import { useState, useEffect, forwardRef } from 'react';

// material-ui
import {
  Box,
  Grid,
  Slider,
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  FormControl,
  FormLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const commonInputStyle = {
  height: 50,
  '& .MuiInputBase-root': {
    height: '100%',
    alignItems: 'center'
  },
  '& .MuiInputBase-input': {
    height: 'calc(100% - 20px)'
  },
  paddingY: 40
};

const WeightSlider = styled(Slider)({
  height: 8,
  '& .MuiSlider-track': {
    border: 'none'
  },
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit'
    },
    '&::before': {
      display: 'none'
    }
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: '#1677ff',
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&::before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)'
    },
    '& > *': {
      transform: 'rotate(45deg)'
    }
  }
});

// ==============================|| SETTING FORM ||============================== //

const Setting = forwardRef(({ handler, defaultValues }, ref) => {
  const [open, setOpen] = useState(false);

  const [slider1Value, setSlider1Value] = useState(1);
  const [slider2Value, setSlider2Value] = useState(1);

  const handleSlider1Change = (event, newValue) => {
    setSlider1Value(newValue);
  };

  const handleSlider2Change = (event, newValue) => {
    setSlider2Value(newValue);
  };

  const handleClose = () => {
    setSlider1Value(1);
    setSlider2Value(1);
    setOpen(false);
  };

  useEffect(() => {
    if (slider1Value === 0 && slider2Value === 0) {
      setOpen(true);
    }
  }, [slider1Value, slider2Value]);

  useEffect(() => {
    setSlider1Value(Number(defaultValues?.weight_1 || 1));
    setSlider2Value(Number(defaultValues?.weight_2 || 1));
  }, [defaultValues]);

  return (
    <Box>
      <Box
        component="form"
        autoComplete="off"
        onSubmit={handler}
        ref={ref}
        sx={{
          '& .MuiTextField-root': { m: 1, ...commonInputStyle },
          paddingTop: 5,
          paddingBottom: 5
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} container justifyContent="center">
            <Grid item sm={6}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend" id="label">
                  To what extent is the patient&apos;s data related to lung cancer?
                </FormLabel>
                <WeightSlider
                  value={slider1Value}
                  onChange={handleSlider1Change}
                  valueLabelDisplay="auto"
                  aria-label="slider-1"
                  name="weight_1"
                  max={5}
                  marks
                />
              </FormControl>
            </Grid>
          </Grid>
          <Grid item xs={12} container justifyContent="center">
            <Grid item sm={6}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">To what extent is the patient&apos;s data related to general in-hospital outcomes?</FormLabel>
                <WeightSlider
                  value={slider2Value}
                  onChange={handleSlider2Change}
                  valueLabelDisplay="auto"
                  aria-label="slider-2"
                  name="weight_2"
                  max={5}
                  marks
                />
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Weights Error</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Both weights cannot be set to 0. Please provide a non-zero weight for at least one group models. Setting both weights to 0
            disables the risk assessment, making it ineffective.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Understood</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default Setting;
