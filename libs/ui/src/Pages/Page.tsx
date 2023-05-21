import { Card, Title, Text } from '@tremor/react';
import Search from '../search';
import UsersTable from '../table';
import Page from '../Page';


export default function IndexPage() {
  const users = [
    {
      id: 1234,
      name: "John Doe",
      username: "johnDoe",
      email: "johndoe@gmail.com",
    }
  ]

  return (
    <Page>
      <Title>Users</Title>
      <Text>
        A list of users retrieved from a MySQL database (PlanetScale).
      </Text>
      <Search />
      <Card className="mt-6">
        <UsersTable users={users} />
      </Card>
    </Page>
  );
}
