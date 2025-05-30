import React, { FC } from 'react';
import PropTypes from 'prop-types';
import ateneaImg from '../assets/logos/AteneaLogo.png';

interface ILogoProps {
	width?: number;
	height?: number;
}
const Logo: FC<ILogoProps> = ({ width, height }) => {
	return <img width={width} height={height} src={ateneaImg} style={{ objectFit: 'contain' }} />;
};
Logo.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
};
Logo.defaultProps = {
	width: 2155,
	height: 854,
};

export default Logo;
