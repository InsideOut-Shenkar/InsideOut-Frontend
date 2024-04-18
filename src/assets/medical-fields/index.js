import AWS from 'aws-sdk';

class MedicalFieldsFetcher {
  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
      region: process.env.REACT_APP_S3_REGION
    });

    this.data = [];
    this.#fetchData();
  }

  async #fetchData() {
    const params = {
      Bucket: process.env.REACT_APP_S3_NAME,
      Key: process.env.REACT_APP_MF_FILE_NAME
    };

    try {
      const data = await this.s3.getObject(params).promise();
      this.data = JSON.parse(data.Body.toString('utf-8'));
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  get(includes = [], excludes = []) {
    return this.data
      .map((item, index) => {
        const itemNameLower = item.standard_column_name.toLowerCase();

        if (excludes.includes(itemNameLower)) {
          return null;
        }

        if (includes.length > 0 && !includes.includes(itemNameLower)) {
          return null;
        }

        const result = {
          id: index,
          type: item.datatype,
          name: item.standard_column_name
        };

        if (item.datatype === 'category') {
          result.options = item.standard_input_values?.categories;
        } else if (item.datatype === 'int' || item.datatype === 'float') {
          result.range = item.standard_input_values?.range;
        }

        return result;
      })
      .filter((item) => item !== null);
  }
}

const MedicalFields = new MedicalFieldsFetcher();

export default MedicalFields;
