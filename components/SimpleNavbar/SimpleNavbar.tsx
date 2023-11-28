import { useState } from 'react';
import {
	Navbar,
	Center,
	Tooltip,
	UnstyledButton, 
	createStyles,
	Stack,
} from '@mantine/core';
import { TablerIcon, IconHome2, IconZoomQuestion, IconUserCircle ,IconBook,IconBrandWechat} from '@tabler/icons';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';

const useStyles = createStyles((theme) => ({
	link: {
		width: 50,
		height: 50,
		borderRadius: theme.radius.md,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		color: theme.white,
		opacity: 0.85,

		'&:hover': {
			opacity: 1,
			backgroundColor: theme.fn.lighten(
				theme.fn.variant({
					variant: 'filled',
					color: theme.primaryColor,
				}).background!,
				0.1
			),
			// backgroundColor: '#eef4ed',
		},
	},

	active: {
		opacity: 1,
		'&, &:hover': {
			backgroundColor: theme.fn.lighten(
				theme.fn.variant({
					variant: 'filled',
					color: theme.primaryColor,
				}).background!,
				0.15
			),
			// backgroundColor: '#eef4ed',
		},
	},
}));

interface NavbarLinkProps {
	icon: TablerIcon;
	label: string;
	active?: boolean;
	onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
	const { classes, cx } = useStyles();
	return (
		<Tooltip label={label} position='right' transitionDuration={0}>
			<UnstyledButton
				onClick={onClick}
				mb={10}
				className={cx(classes.link, { [classes.active]: active })}
			>
				<Icon stroke={1.5} />
			</UnstyledButton>
		</Tooltip>
	);
}

export function SimpleNavbar() {
	const [active, setActive] = useState(0);
	const { classes, cx } = useStyles();
	const { address } = useAccount();
	const router = useRouter();
	const mockdata = [
		{
			icon: IconUserCircle,
			label: 'Your Profile',
			link: `/user-profile?address=${address}`,
		},
		{ icon: IconHome2, label: 'Home', link: '/home' },

	];

	const links = mockdata.map((link, index) => (
		<Link href={link.link}>
			<NavbarLink
				{...link}
				key={link.label}
				active={link.link == router.asPath}
				onClick={() => {
					setActive(index);
				}}
			/>
		</Link>
	));

	return (
		<Navbar
			height={'100vh'}
			width={{ base: 80 }}
			p='md'
			sx={(theme) => ({
				// backgroundColor: theme.fn.variant({
				// 	variant: 'filled',
				// 	color: theme.primaryColor,
				// }).background,
				backgroundColor: '#000',
			})}
		>
			<Navbar.Section grow mt={50}>
				<Stack justify='center' spacing={4}>
					{links}
				</Stack>
			</Navbar.Section>
		</Navbar>
	);
}
