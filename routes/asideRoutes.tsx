import React from 'react';
import dynamic from 'next/dynamic';

const DefaultAside = dynamic(() => import('../pages/_layout/_asides/DefaultAside'));

const asides = [{ path: '/*', element: <DefaultAside />, exact: true }];

export default asides;
