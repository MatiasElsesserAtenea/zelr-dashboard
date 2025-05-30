import React from 'react';
import type { NextPage } from 'next';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import Card, { CardBody, CardHeader, CardTitle } from '../../../components/bootstrap/Card';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Label from '../../../components/bootstrap/forms/Label';
import Input from '../../../components/bootstrap/forms/Input';

const Index: NextPage = () => {
	return (
		<PageWrapper>
			<Head>
				<title>Configuración</title>
			</Head>
			<Page container='fluid'>
				<Card className='h-100'>
					<CardHeader>
						<CardTitle className='m-auto'> Configuración de email</CardTitle>
					</CardHeader>
					<CardBody>
						<FormGroup className='row'>
							<div className='col-12 col-md-6 mb-4'>
								<Label>Nombre:</Label>
								<Input type='text' />
							</div>
							<div className='col-12 col-md-6 mb-4'>
								<Label>Usuario</Label>
								<Input type='text' />
							</div>
							<div className='col-12 col-md-6 mb-4'>
								<Label>Servidor IMAP</Label>
								<Input type='text' />
							</div>
							<div className='col-12 col-md-6 mb-4'>
								<Label>Puerto IMAP</Label>
								<Input type='text' />
							</div>
							<div className='col-12 col-md-6 mb-4'>
								<Label>Tipo de autenticación</Label>
								<Input type='text' />
							</div>
							<div className='col-12 col-md-6 mb-4'>
								<Label>Servidor SMTP</Label>
								<Input type='text' />
							</div>
							<div className='col-12 col-md-6 mb-4'>
								<Label>Puerto SMTP</Label>
								<Input type='text' />
							</div>
							<div className='col-12 col-md-6 mb-4'>
								<Label>Tipo de autenticación</Label>
								<Input type='text' />
							</div>
						</FormGroup>
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
