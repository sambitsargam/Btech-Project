import { AsyncInput } from '../AsyncInput/AsyncInput';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { useEnsAddress } from 'wagmi';
import { Button } from '../Button/Button';
import { KeyboardEvent } from 'react';

const isENS = (address: string) => address.endsWith('.eth');
const isAddress = (address: string) => ethers.utils.isAddress(address);

export interface AddressProps {
	onSubmit: (address:`0x${string}`) => void;
	disabled?: boolean;
}

export function AddressInput(props: AddressProps) {
	const [value, setValue] = useState<string>("");
	const [error, setError] = useState('');

	const { data, isLoading } = useEnsAddress({
		name: value,
		chainId: 1,
		enabled: isENS(value),
	});

	const isValidENS = !isLoading && !!data;
	const isValid = isValidENS || isAddress(value);

	useEffect(() => {
		if (isLoading || isValid || !value) {
			setError('');
		} else if (isENS(value)) {
			setError('Cannot resolve ENS name');
		} else {
			setError('Address format is invalid');
		}
	}, [value, isLoading, isValid]);

	const submit = (event: KeyboardEvent<HTMLElement>) => {
		console.log("data", data);
		console.log("value", value);
		if (event.key !== 'Enter') return;
		event.preventDefault();

		if (isLoading || !isValid) return;
		// @ts-ignore
		props.onSubmit(data ?? value);
		setValue('');
	};

	return (
		<>
			<AsyncInput
				label={'Add member'}
				placeholder='Address or ENS'
				value={value}
				error={error}
				// disabled={props.disabled}
				loading={isLoading}
				valid={isValid}
				onKeyPress={submit}
				onChange={(event) => setValue(event.currentTarget.value)}
			/>
			<Button
				style={{ width: 150 }}
				onClick={(e: KeyboardEvent<HTMLElement>) => {
					if (isLoading || !isValid) return;
					// @ts-ignore
					props.onSubmit(data ?? value);
					setValue('');
				}}
			>
				Add
			</Button>
		</>
	);
}
