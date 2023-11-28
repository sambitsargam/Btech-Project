import { Loader, TextInput } from '@mantine/core';
import { IconAlertCircle, IconCheck } from '@tabler/icons';

interface AsyncInputProps {
	disabled?: boolean;
	error?: string;
	loading?: boolean;
	valid?: boolean;
	value?: string;
	label?: string;
	required?: boolean;
	placeholder?: string;
	onKeyPress?: React.KeyboardEventHandler<HTMLInputElement>;
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export function AsyncInput(props: AsyncInputProps) {
	const { loading, valid, ...rest } = props;

	const status = props.loading ? (
		<Loader color='#5850EC' size='xs' />
	) : props.valid ? (
		<IconCheck color='#669F2A' />
	) : props.value ? (
		<IconAlertCircle color='#F04438' />
	) : undefined;

	return <TextInput {...rest} rightSection={status} />;
}
