/**
 * External dependencies
 */
import type { ForwardedRef } from 'react';

/**
 * Internal dependencies
 */
import { contextConnect, WordPressComponentProps } from '../../ui/context';
import { Divider, DividerProps } from '../../divider';
import { useCardDivider } from './hook';

export type CardDividerProps = WordPressComponentProps<
	DividerProps,
	'hr',
	false
>;

function CardDivider(
	props: CardDividerProps,
	forwardedRef: ForwardedRef< HTMLHRElement >
) {
	const dividerProps = useCardDivider( props );

	return <Divider { ...dividerProps } ref={ forwardedRef } />;
}

/**
 * `CardDivider` renders an optional divider within a `Card`.
 * It is typically used to divide multiple `CardBody` components from each other.
 *
 * @example
 * ```jsx
 * import { Card, CardBody, CardDivider } from `@wordpress/components`;
 *
 * <Card>
 *  <CardBody>...</CardBody>
 *  <CardDivider />
 *  <CardBody>...</CardBody>
 * </Card>
 * ```
 */
const ConnectedCardDivider = contextConnect< CardDividerProps >(
	CardDivider,
	'CardDivider'
);

export default ConnectedCardDivider;
