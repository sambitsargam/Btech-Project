import {
	ActionIcon,
	Group,
	useMantineColorScheme,
	createStyles,
	useMantineTheme,
	Switch,
} from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons';

export function ActionToggle() {
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();
	const theme = useMantineTheme();
	return (
		// <Group position='center' my='md'>
		// 	<ActionIcon
		// 		onClick={() => toggleColorScheme()}
		// 		size='lg'
		// 		sx={(theme) => ({
		// 			backgroundColor:
		// 				theme.colorScheme === 'dark'
		// 					? theme.colors.dark[6]
		// 					: theme.colors.gray[0],
		// 			color:
		// 				theme.colorScheme === 'dark'
		// 					? theme.colors.yellow[4]
		// 					: theme.colors.blue[6],
		// 		})}
		// 	>
		// 		{colorScheme === 'dark' ? (
		// 			<IconSun size={18} />
		// 		) : (
		// 			<IconMoonStars size={18} />
		// 		)}
		// 	</ActionIcon>
		// </Group>
		<Group position='center' mb='sm'>
			<Switch
				checked={colorScheme === 'dark'}
				onChange={() => toggleColorScheme()}
				size='lg'
				onLabel={<IconSun color={theme.white} size={20} stroke={1.5} />}
				offLabel={
					<IconMoonStars
						color={theme.colors.gray[6]}
						size={20}
						stroke={1.5}
					/>
				}
			/>
		</Group>
	);
}
