import router from 'next/router';
import {useEffect, useState} from 'react';
import {ApolloClient, InMemoryCache, ApolloProvider, gql} from '@apollo/client'
import {AsyncInput} from '../AsyncInput/AsyncInput';
import {useRouter} from "next/router"
import {ACCOUNTS_SEARCH__QUERY} from "../../constants/graphql/queries";

interface NameInputProps {
	parentId: string | number;
	disabled?: boolean;
	value?: string;
	error?: string;
	label?: string;
	placeholder?: string;
	query?: string;
	variables?: object;
	required?: boolean;
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export function NameInput(props: NameInputProps) {
	const [loading, setLoading] = useState(false)
	const [exists, setExists] = useState(false)
	const [error, setError] = useState<string>()
	const [query, setQuery] = useState()
	const router = useRouter()
	const client = new ApolloClient({
		// TODO: Change from testnet to mainnet
		uri: 'https://api.thegraph.com/subgraphs/name/valist-io/valistmumbai',
		cache: new InMemoryCache(),
	})

	useEffect(() => {
		const name = props.value;
		if (router.pathname === '/create-university') {
			setQuery({
				// @ts-ignore
				query: gql(ACCOUNTS_SEARCH__QUERY),
				variables: {
					search: props.value,
				},
			});
		}
		if (router.pathname === '/create-course') {
			setQuery({
				// @ts-ignore
				query: gql(`query UniqueProject( $project: String $accountName: String ) { accounts(where: { name: $accountName }) { projects(where: { name_contains: $project }) { id name } } } `),
				variables: {
					project: name,
					accountName: props.parentId,
				},
			});
		}
	}, [props.value]);
	console.log(query)
	useEffect(() => {
		setLoading(false);
		setExists(false);
		setError(undefined);

		if (!props.value) return;
		setLoading(true);

		const timeout = setTimeout(() => {
			console.log('query', query);
			if (!query) return;
			client
				// @ts-ignore
				.query(query)
				.then((res) => {
					console.log('res', res);
					if (
						router.pathname === '/create-university' &&
						res.data.accounts.length > 0
					) {
						setError('Name already exists');
						setExists(true);
					} else if (
						router.pathname === '/create-project' &&
						res.data.accounts.length > 0
					) {
						if (res.data.accounts[0].projects.length > 0) {
							setError('Name already exists');
							setExists(true);
						} else {
							setError(undefined);
							setExists(false);
						}
					} else {
						setError(undefined);
						setExists(false);
					}
				})
				.finally(() => setLoading(false));
		}, 1000);

		return () => clearTimeout(timeout);
	}, [props.value, props.parentId]);

	useEffect(() => {
		if (exists) {
			setError('Name has been taken');
		}
	}, [exists]);

	const isValid = !!props.value && !exists && !loading;

	return (
		<AsyncInput
			value={props.value}
			error={error ?? props.error}
			disabled={props.disabled}
			loading={loading}
			label={props.label}
			placeholder={props.placeholder}
			required={props.required}
			valid={isValid}
			onChange={props.onChange}
		/>
	);
}
