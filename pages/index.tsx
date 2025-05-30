import React, { useContext, useEffect } from 'react';
import type { NextPage } from 'next';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTour } from '@reactour/tour';
import PageWrapper from '../layout/PageWrapper/PageWrapper';
import ThemeContext from '../context/themeContext';
import Page from '../layout/Page/Page';
import Card, { CardBody } from '../components/bootstrap/Card';

const Index: NextPage = () => {
	const { mobileDesign } = useContext(ThemeContext);
	/**
	 * Tour Start
	 */
	const { setIsOpen } = useTour();
	useEffect(() => {
		if (
			typeof window !== 'undefined' &&
			localStorage.getItem('tourModalStarted') !== 'shown' &&
			!mobileDesign
		) {
			setTimeout(() => {
				setIsOpen(true);
				localStorage.setItem('tourModalStarted', 'shown');
			}, 3000);
		}
		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<PageWrapper>
			<Head>
				<title>Zelr</title>
			</Head>

			<Page container='fluid'>
				<Card className='h-100'>
					<CardBody>
						<div className='row text-center align-items-center jsutify-content-center h-100'>
							<h1>Bienvenido a Zelr</h1>
						</div>
					</CardBody>
				</Card>
			</Page>
		</PageWrapper>
	);
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		// @ts-ignore
		...(await serverSideTranslations(locale, ['common', 'menu'])),
	},
});

export default Index;
