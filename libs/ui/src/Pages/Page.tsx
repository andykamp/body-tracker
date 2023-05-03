import { Card, Title, Text } from '@tremor/react';
import Search from '../search';
import UsersTable from '../table';


export default function IndexPage({
  // searchParams
}: {
  // searchParams: { q: string };
}) {
  // const search = searchParams.q ?? '';
  const users = [
    {
      id: 1234,
      name: "John Doe",
      username: "johnDoe",
      email: "johndoe@gmail.com",
    }
  ]

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Users</Title>
      <Text>
        A list of users retrieved from a MySQL database (PlanetScale).
      </Text>
      <Search />
      <Card className="mt-6">
        <UsersTable users={users} />
      </Card>
    </main>
  );
}
