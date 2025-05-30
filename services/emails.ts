export const L3_PATH = 'http://162.254.37.201:9004';

// curl -X 'GET' \
//   'http://localhost:9004/email_content/list/?user_id=04ddb17f-5693-4b72-a6d1-40359d9b18fe' \
//   -H 'accept: application/json'

export const getUserEmails = async (user_id: string) => {
	try {
		const response = await fetch(`${L3_PATH}/email_content/list/?user_id=${user_id}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			return {
				error: true,
				message: `La petición no fue existosa, status: [${response.status}]`,
				data: {},
			};
		}
		const jsonRes = await response.json();

		if (typeof jsonRes === 'string' && jsonRes.startsWith('Error')) {
			return { error: true, message: `${jsonRes}`, data: {} };
		}

		return { data: jsonRes.data, message: 'Success', error: false };
	} catch (e) {
		const errorType =
			e instanceof Error ? e.message : 'Error desconocido en el servicio [getUserEmails]';
		return {
			data: {},
			error: true,
			message: errorType,
		};
	}
};

// 'http://localhost:9004/email_content/226948c9-1367-4194-8744-45dfcbceb565/update' \
// -H 'accept: application/json' \
// -H 'Content-Type: multipart/form-data' \
// -F 'subject=Correo 2' \
// -F 'body=Correo modificado' \
// -F 'wait_days=5' \
// -F 'deleted_attachements=3fa85f64-5717-4562-b3fc-2c963f66afa6' \
// -F 'attachements=@lista_productos-2.pdf;type=application/pdf' \
// -F 'attachements=@lista_productos.pdf;type=application/pdf'

interface ISaveEmailDataParams {
	subject: string;
	body: string;
	wait_days: number;
	deleted_attachements: string[];
	attachements: File[];
	email_id?: string;
}

export const saveEmailData = async ({
	subject,
	body,
	wait_days,
	deleted_attachements,
	attachements,
	email_id,
}: ISaveEmailDataParams) => {
	try {
		const formData = new FormData();

		formData.append('subject', subject);
		formData.append('body', body);
		formData.append('wait_days', wait_days.toString());
		if (deleted_attachements.length > 0) {
			deleted_attachements.forEach((atch) => {
				formData.append('deleted_attachements', atch);
			});
		}

		attachements.forEach((file) => {
			formData.append('attachements', file);
		});

		const url = `${L3_PATH}/email_content/${email_id}/update`;
		// const url = `/api/emails/proxy-emails?email_id=${email_id}`;

		const response = await fetch(url, {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
			},
			body: formData,
		});

		if (!response.ok) {
			return {
				error: true,
				message: `La petición no fue exitosa, status: [${response.status}]`,
				data: {},
			};
		}

		const jsonRes = await response.json();

		if (typeof jsonRes === 'string' && jsonRes.startsWith('Error')) {
			return { error: true, message: `${jsonRes}`, data: {} };
		}

		return { data: jsonRes, message: 'Success', error: false };
	} catch (e) {
		const errorType =
			e instanceof Error ? e.message : 'Error desconocido en el servicio [saveEmailData]';
		return {
			data: {},
			error: true,
			message: errorType,
		};
	}
};
