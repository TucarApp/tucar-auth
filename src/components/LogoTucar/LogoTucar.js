import React from 'react';
import Color from '../../svg/TucarColor';
import White from '../../svg/TucarWhite';

const Logo = ({ color, ...props }) => {
	const Component = color !== 'white' ? Color : White;
	return (
		<Component {...props} />
	);
};

export default Logo;