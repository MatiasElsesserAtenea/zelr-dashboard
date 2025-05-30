import React from 'react';
import { toast } from 'react-toastify';
import Toasts from '../bootstrap/Toasts';

export interface TriggerToastParams {
	title: string;
	message: string;
	result: 'success' | 'error';
	timeClose?: number;
}

const triggerToast = ({ result, message, title, timeClose }: TriggerToastParams) => {
	toast(<Toasts title={title}>{message}</Toasts>, {
		closeButton: true,
		autoClose: timeClose || 3000,
		type: result === 'success' ? 'success' : 'error',
		hideProgressBar: false,
		closeOnClick: true,
	});
};
export default triggerToast;
