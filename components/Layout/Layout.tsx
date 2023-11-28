import { AppShell, Footer } from '@mantine/core';
import { ReactNode } from 'react';
import { SimpleHeader } from '../SimpleHeader/SimpleHeader';
import { SimpleNavbar } from '../SimpleNavbar/SimpleNavbar';

interface Props {
	children?: ReactNode;
}

export function Layout({ children }: Props) {
	return (
		<AppShell
			padding='md'
			header={<SimpleHeader />}
			navbar={<SimpleNavbar />}
			// footer={}
		>
			{children}
		</AppShell>
	);
}
