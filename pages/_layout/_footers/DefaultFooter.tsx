import React from 'react';
import Footer from '../../../layout/Footer/Footer';
import { imgPoweredByAtena } from '../../../assets/img/imgPowerByAtenea';

const DefaultFooter = () => {
	return (
		<Footer style={{ background: 'transparent', margin: '1rem 0 0', boxShadow: 'none' }}>
			<div className='container-fluid d-flex align-items-center justify-content-center'>
				<a href='https://www.atenea.ai/'>
					<img
						src={imgPoweredByAtena}
						alt='ateneaLogo'
						style={{
							// filter: "grayscale(1) drop-shadow(0 0 0rem #8a8a8a)",
							height: '20px',
						}}
					/>
				</a>
			</div>
		</Footer>
	);
};

export default DefaultFooter;
