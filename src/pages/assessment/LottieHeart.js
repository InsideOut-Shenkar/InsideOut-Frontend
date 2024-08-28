import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

// lottie
import Lottie from 'react-lottie';

// assets
import healthRiskAssessment from 'assets/images/lottie-files/healthRiskAssessment.json';

// ==============================|| LOTTIE ANIMATION ||============================== //

const LottieHeart = ({ run }) => {
  const lottieRef = useRef();

  useEffect(() => {
    if (lottieRef.current && lottieRef.current.anim) {
      const animation = lottieRef.current.anim;
      if (run) {
        animation.goToAndPlay(0, true); // Start the animation from the beginning
      } else {
        animation.goToAndStop(animation.totalFrames - 1, true); // Go to the last frame and stop
      }
    }
  }, [run]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: healthRiskAssessment,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <Lottie
      options={defaultOptions}
      height={200}
      width={200}
      ref={lottieRef}
      eventListeners={[
        {
          eventName: 'DOMLoaded',
          callback: () => {
            const animation = lottieRef.current.anim;
            animation.goToAndStop(animation.totalFrames, true);
          }
        }
      ]}
    />
  );
};

LottieHeart.propTypes = {
  run: PropTypes.bool
};

export default LottieHeart;
