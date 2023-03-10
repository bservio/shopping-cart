import storeItems from "../data/items.json"
import { Col, Row } from "react-bootstrap";
import { StoreItem } from '../components/StoreItem';

export function Store() {
	return (
		<>
			<h1>Store</h1>
			<Row sm={1} md={2} lg={3} className="g-3">
				{storeItems.map(item => (
					<Col>{<StoreItem {...item} />}</Col>
				))}
			</Row>
		</>
	)
}