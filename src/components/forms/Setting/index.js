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
  FormLabel,
  Rating
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

const percentage = 100;

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#ff6d75',
  },
  '& .MuiRating-iconHover': {
    color: '#ff3d47',
  },
});

// ==============================|| SETTING FORM ||============================== //

const Setting = ({ handler }) => {
  const [open, setOpen] = useState(false);

  const [slider1Value, setSlider1Value] = useState(percentage * 0.05);
  const [slider2Value, setSlider2Value] = useState(percentage * 0.95);

  const handleSlider1Change = (event, newValue) => {
    setSlider1Value(newValue);
    setSlider2Value(percentage - newValue);
  };

  const handleSlider2Change = (event, newValue) => {
    setSlider2Value(newValue);
    setSlider1Value(percentage - newValue);
  };

  const handleClose = () => {
    setSlider1Value(percentage * 0.05);
    setSlider2Value(percentage * 0.95);
    setOpen(false);
  };

  useEffect(() => {
    if (slider1Value === 0 || slider2Value === 0) {
      setOpen(true);
    }
  }, [slider1Value, slider2Value]);

  return (
    <Box>
      <Box
        component="form"
        autoComplete="off"
        onSubmit={handler}
        sx={{
          '& .MuiTextField-root': { m: 1, ...commonInputStyle },
          paddingTop: 5,
          paddingBottom: 5
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} container justifyContent="center">
            <Grid sm={6}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">Dataset 1 Weight</FormLabel>
                <WeightSlider value={slider1Value} onChange={handleSlider1Change} valueLabelDisplay="auto" aria-label="slider-1" />
              </FormControl>
            </Grid>
          </Grid>
          <Grid item xs={12} container justifyContent="center">
            <Grid sm={6}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">Dataset 2 Weight</FormLabel>
                <WeightSlider value={slider2Value} onChange={handleSlider2Change} valueLabelDisplay="auto" aria-label="slider-2" />
              </FormControl>
            </Grid>
          </Grid>
          <Grid item xs={12} container justifyContent="center">
            <Grid sm={6}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">Dataset 1 Weight</FormLabel>
                <WeightSlider value={slider1Value} onChange={handleSlider1Change} valueLabelDisplay="auto" aria-label="slider-1" />
              </FormControl>
            </Grid>
          </Grid>
          <Grid item xs={12} container justifyContent="center">
            <Grid sm={6}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">Dataset 2 Weight</FormLabel>
                <WeightSlider value={slider2Value} onChange={handleSlider2Change} valueLabelDisplay="auto" aria-label="slider-2" />
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
        <DialogTitle>{'Weight Error'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Each dataset must have a weight greater than 0. Weights ensure proper risk assessment by utilizing both datasets.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Understood</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Setting;
