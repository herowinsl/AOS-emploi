import { Card, Button } from "flowbite-react";

export default function App() {
  return (
    <div>
      <Card>
        <Card.Body>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
          </p>
        </Card.Body>
        <Card.Footer>
          <Button>Click me</Button>
        </Card.Footer>
      </Card>
    </div>
  );
}
