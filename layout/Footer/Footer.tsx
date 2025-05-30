import React, { CSSProperties, FC, ReactNode } from 'react';
import { useMeasure } from 'react-use';
import useRoot from '../../hooks/useRoot';

interface IFooterProps {
	children: ReactNode;
	style: CSSProperties;
}
const Footer: FC<IFooterProps> = ({ children, style }) => {
	const [ref, { height }] = useMeasure<HTMLDivElement>();

	const root = useRoot();
	root?.style.setProperty('--footer-height', `${height}px`);

	return (
		<footer ref={ref} className='footer' style={style}>
			{children}
		</footer>
	);
};

export default Footer;
