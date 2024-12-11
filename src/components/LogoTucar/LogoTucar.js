import React from 'react';
import Color from '../../../public/svg/TucarColor';
import White from '../../../public/svg/TucarWhite';

const Logo = ({ color, ...props }) => {
	const Component = color !== 'white' ? Color : White;
	return (
		<Component {...props} />
	);
};

export default Logo;