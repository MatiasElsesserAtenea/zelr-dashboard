import React, { useEffect, useRef, useState } from 'react';
import type { NextPage } from 'next';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import Label from '../../../components/bootstrap/forms/Label';
import Input from '../../../components/bootstrap/forms/Input';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import Button from '../../../components/bootstrap/Button';
import { getUserEmails, saveEmailData } from '../../../services/emails';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import triggerToast from '../../../components/utils/TriggerToast';
import Spinner from '../../../components/bootstrap/Spinner';

interface IAttachment {
	id: string;
	file_name: string;
	file_path: string;
	file_extension: string;
}

interface IEmailData {
	id: string;
	subject: string;
	body: string;
	wait_days: number;
	attachements: IAttachment[];
}

interface IFormState {
	firstEmail: IEmailData;
	secondEmail: IEmailData;
}
const Index: NextPage = () => {
	const [data, setData] = useState<IFormState>({
		firstEmail: {
			id: '',
			subject: '',
			body: '',
			wait_days: 0,
			attachements: [],
		},
		secondEmail: {
			id: '',
			subject: '',
			body: '',
			wait_days: 0,
			attachements: [],
		},
	});

	const [newFiles, setNewFiles] = useState<{
		firstEmail: File[];
		secondEmail: File[];
	}>({
		firstEmail: [],
		secondEmail: [],
	});

	const [deletedAttachments, setDeletedAttachments] = useState<{
		firstEmail: string[];
		secondEmail: string[];
	}>({
		firstEmail: [],
		secondEmail: [],
	});

	const [loading, setLoading] = useState(false);
	const fileInputRefs = {
		firstEmail: useRef<HTMLInputElement>(null),
		secondEmail: useRef<HTMLInputElement>(null),
	};

	const loadUserEmails = async () => {
		setLoading(true);
		try {
			const userId = 'e04866e8-ee30-4a41-8587-6050f45f026c';
			const result = await getUserEmails(userId);

			if (
				!result.error &&
				result.data &&
				Array.isArray(result.data) &&
				result.data.length > 0
			) {
				const emails = result.data;
				setData({
					firstEmail: emails[0] || {
						id: '',
						subject: '',
						body: '',
						wait_days: 0,
						attachements: [],
					},
					secondEmail: emails[1] || {
						id: '',
						subject: '',
						body: '',
						wait_days: 0,
						attachements: [],
					},
				});
			}
		} catch (error) {
			console.error('Error loading emails:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleInputChange = (
		emailType: 'firstEmail' | 'secondEmail',
		field: string,
		value: string | number,
	) => {
		setData((prev) => ({
			...prev,
			[emailType]: {
				...prev[emailType],
				[field]: value,
			},
		}));
	};

	const handleFileChange = (emailType: 'firstEmail' | 'secondEmail', files: FileList | null) => {
		if (files) {
			const fileArray = Array.from(files);
			setNewFiles((prev) => ({
				...prev,
				[emailType]: [...prev[emailType], ...fileArray],
			}));
		}
	};

	const removeExistingAttachment = (
		emailType: 'firstEmail' | 'secondEmail',
		attachmentId: string,
	) => {
		setDeletedAttachments((prev) => ({
			...prev,
			[emailType]: [...prev[emailType], attachmentId],
		}));

		setData((prev) => ({
			...prev,
			[emailType]: {
				...prev[emailType],
				attachements: prev[emailType].attachements.filter(
					(att: IAttachment) => att.id !== attachmentId,
				),
			},
		}));
	};

	const removeNewFile = (emailType: 'firstEmail' | 'secondEmail', fileIndex: number) => {
		setNewFiles((prev) => ({
			...prev,
			[emailType]: prev[emailType].filter((_, index) => index !== fileIndex),
		}));
	};

	const clearFileInput = (emailType: 'firstEmail' | 'secondEmail') => {
		if (fileInputRefs[emailType].current) {
			fileInputRefs[emailType].current.value = '';
		}
	};

	const handleSave = async (emailType: 'firstEmail' | 'secondEmail') => {
		setLoading(true);
		try {
			const emailData = data[emailType];
			const result = await saveEmailData({
				subject: emailData.subject,
				body: emailData.body,
				wait_days: emailData.wait_days,
				deleted_attachements: deletedAttachments[emailType],
				attachements: newFiles[emailType],
				email_id: emailData.id || undefined,
			});

			if (!result.error) {
				setNewFiles((prev) => ({ ...prev, [emailType]: [] }));
				setDeletedAttachments((prev) => ({ ...prev, [emailType]: [] }));
				clearFileInput(emailType);

				await loadUserEmails();

				triggerToast({
					message: 'Email guardado correctamente',
					result: 'success',
					title: 'Éxito',
					timeClose: 3000,
				});
			} else {
				triggerToast({
					message: `Error al guardar: ${result.message}`,
					result: 'error',
					title: 'Error',
					timeClose: 3000,
				});
			}
		} catch (error) {
			triggerToast({
				message: `Error al guardar el email`,
				result: 'error',
				title: 'Error',
				timeClose: 3000,
			});
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		loadUserEmails();
	}, []);

	const renderAttachmentSection = (emailType: 'firstEmail' | 'secondEmail') => {
		const emailData = data[emailType];
		const newFilesForEmail = newFiles[emailType];
		const totalFiles = emailData.attachements.length + newFilesForEmail.length;

		return (
			<div className='col-12 col-md-6'>
				<Label htmlFor='#'>Adjuntos:</Label>
				<Dropdown>
					<DropdownToggle>
						<Button
							color='light'
							isOutline
							className='w-100 d-flex justify-content-between align-items-center'>
							<span>
								{totalFiles > 0
									? `${totalFiles} archivo${totalFiles !== 1 ? 's' : ''}`
									: 'Sin archivos'}
							</span>
						</Button>
					</DropdownToggle>
					<DropdownMenu className='w-100' style={{ minWidth: '300px' }}>
						<DropdownItem>
							<div className='p-2 d-flex flex-column justify-content-start'>
								<Label
									htmlFor='input-file-1'
									className='small text-muted mb-0 me-auto ms-2'>
									Añadir archivos:
								</Label>
								<Input
									type='file'
									multiple
									id='input-file-1'
									ref={fileInputRefs[emailType]}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										handleFileChange(emailType, e.target.files)
									}
									size='sm'
								/>
							</div>
						</DropdownItem>

						{totalFiles > 0 && <DropdownItem isDivider />}

						{emailData.attachements.length > 0 && (
							<>
								<DropdownItem isHeader>
									<small className='text-success'>Archivos guardados</small>
								</DropdownItem>
								{emailData.attachements.map((attachment) => (
									<DropdownItem key={attachment.id}>
										<div className='d-flex justify-content-between align-items-center w-100 py-1'>
											<div className='d-flex align-items-center flex-grow-1'>
												<i
													className='fas fa-file me-2 text-muted'
													style={{ fontSize: '12px' }}
												/>
												<span
													className='small text-truncate'
													title={attachment.file_name}>
													{attachment.file_name}
												</span>
											</div>
											<Button
												size='sm'
												color='danger'
												isLight
												className='ms-2 p-1'
												style={{ fontSize: '10px', lineHeight: 1 }}
												onClick={(e: any) => {
													e.stopPropagation();
													removeExistingAttachment(
														emailType,
														attachment.id,
													);
												}}>
												×
											</Button>
										</div>
									</DropdownItem>
								))}
							</>
						)}

						{newFilesForEmail.length > 0 && (
							<>
								{emailData.attachements.length > 0 && <DropdownItem isDivider />}
								<DropdownItem isHeader>
									<small className='text-warning'>
										Archivos nuevos (no guardados)
									</small>
								</DropdownItem>
								{newFilesForEmail.map((file, index) => (
									<DropdownItem key={`${file.name}-${file.size}`}>
										<div className='d-flex justify-content-between align-items-center w-100 py-1'>
											<div className='d-flex align-items-center flex-grow-1'>
												<i
													className='fas fa-file-plus me-2 text-warning'
													style={{ fontSize: '12px' }}
												/>
												<span
													className='small text-truncate'
													title={file.name}>
													{file.name}
												</span>
											</div>
											<Button
												size='sm'
												color='warning'
												isLight
												rounded='circle'
												className='ms-2 p-1'
												style={{ fontSize: '10px', lineHeight: 1 }}
												onClick={(e: any) => {
													e.stopPropagation();
													removeNewFile(emailType, index);
												}}>
												×
											</Button>
										</div>
									</DropdownItem>
								))}
							</>
						)}

						{totalFiles === 0 && (
							<DropdownItem isText>
								<small className='text-muted'>No hay archivos adjuntos</small>
							</DropdownItem>
						)}
					</DropdownMenu>
				</Dropdown>
			</div>
		);
	};
	if (loading) {
		return (
			<PageWrapper>
				<Head>
					<title>Emails</title>
				</Head>
				<Page container='fluid'>
					<Card className='h-100'>
						<CardBody className='d-flex justify-content-center align-items-center'>
							<Spinner size={30} />
						</CardBody>
					</Card>
				</Page>
			</PageWrapper>
		);
	}

	return (
		<PageWrapper>
			<Head>
				<title>Emails</title>
			</Head>
			<Page container='fluid'>
				<Card className='h-100'>
					<CardBody className='mh-100 overflow-auto'>
						<section className='row mb-3'>
							<h4 className='mb-3'>Primer email:</h4>
							<div>
								<div className='row justify-content-between mb-3'>
									<div className='col-12 col-md-6'>
										<Label htmlFor='subject1'>Asunto:</Label>
										<Input
											type='text'
											id='subject1'
											value={data.firstEmail.subject}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
												handleInputChange(
													'firstEmail',
													'subject',
													e.target.value,
												)
											}
										/>
									</div>
									{renderAttachmentSection('firstEmail')}
								</div>
								<div className='row mb-3'>
									<div className='col-12'>
										<Label htmlFor='body1'>Cuerpo del mensaje:</Label>
										<Textarea
											rows={5}
											id='body1'
											value={data.firstEmail.body}
											onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
												handleInputChange(
													'firstEmail',
													'body',
													e.target.value,
												)
											}
										/>
									</div>
								</div>
								<div className='row justify-content-between align-items-end'>
									<div className='col-3'>
										<Button
											isOutline
											color='light'
											type='button'
											onClick={() => handleSave('firstEmail')}
											isDisable={loading}>
											{loading ? 'Guardando...' : 'Guardar'}
										</Button>
									</div>
									<div className='col-3'>
										<Label htmlFor='wait_days1'>Días de espera:</Label>
										<Input
											id='wait_days1'
											type='number'
											value={data.firstEmail.wait_days}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
												handleInputChange(
													'firstEmail',
													'wait_days',
													parseInt(e.target.value, 2) || 0,
												)
											}
										/>
									</div>
								</div>
							</div>
						</section>

						<hr />

						<section className='row'>
							<h4 className='mb-3'>Segundo email:</h4>
							<div>
								<div className='row justify-content-between mb-3'>
									<div className='col-12 col-md-6'>
										<Label htmlFor='subject'>Asunto:</Label>
										<Input
											id='subject'
											type='text'
											value={data.secondEmail.subject}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
												handleInputChange(
													'secondEmail',
													'subject',
													e.target.value,
												)
											}
										/>
									</div>
									{renderAttachmentSection('secondEmail')}
								</div>
								<div className='row mb-3'>
									<div className='col-12'>
										<Label htmlFor='body'>Cuerpo del mensaje:</Label>
										<Textarea
											id='body'
											rows={5}
											value={data.secondEmail.body}
											onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
												handleInputChange(
													'secondEmail',
													'body',
													e.target.value,
												)
											}
										/>
									</div>
								</div>
								<div className='row justify-content-between align-items-end'>
									<div className='col-3'>
										<Button
											isOutline
											color='light'
											type='button'
											onClick={() => handleSave('secondEmail')}
											isDisable={loading}>
											{loading ? 'Guardando...' : 'Guardar'}
										</Button>
									</div>
									<div className='col-3'>
										<Label htmlFor='wait_days'>Días de espera:</Label>
										<Input
											type='number'
											id='wait_days'
											value={data.secondEmail.wait_days}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
												handleInputChange(
													'secondEmail',
													'wait_days',
													parseInt(e.target.value, 2) || 0,
												)
											}
										/>
									</div>
								</div>
							</div>
						</section>
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
