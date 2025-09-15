import type { Meta, StoryObj } from '@storybook/nextjs'
import { FiUser, FiMail, FiCalendar, FiMoreHorizontal } from 'react-icons/fi'
import {
  Table,
  TableContainer,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableFooter,
  TableEmptyState,
} from './Table'
import { Button } from '../button/Button'
import { Badge } from '../badge/Badge'

const meta: Meta<typeof Table> = {
  title: 'UI/Table',
  component: Table,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// Sample data for stories
const sampleUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'Active',
    joinDate: '2024-01-15',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Editor',
    status: 'Active',
    joinDate: '2024-01-20',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'Viewer',
    status: 'Inactive',
    joinDate: '2024-01-10',
  },
  {
    id: '4',
    name: 'Alice Brown',
    email: 'alice@example.com',
    role: 'Editor',
    status: 'Active',
    joinDate: '2024-01-25',
  },
]

export const Default: Story = {
  render: () => (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sampleUsers.map((user) => (
            <TableRow key={user.id} hover>
              <TableCell>
                <div className="font-semibold">{user.name}</div>
              </TableCell>
              <TableCell>
                <div className="text-base-content/70">{user.email}</div>
              </TableCell>
              <TableCell>
                <Badge variant={user.role === 'Admin' ? 'destructive' : user.role === 'Editor' ? 'nps' : 'feature'}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={user.status === 'Active' ? 'general' : 'outline'}>
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  <FiMoreHorizontal className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ),
}

export const Zebra: Story = {
  render: () => (
    <TableContainer>
      <Table variant="zebra">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sampleUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.joinDate}</TableCell>
              <TableCell>
                <Badge variant={user.status === 'Active' ? 'general' : 'outline'}>
                  {user.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ),
}

export const Compact: Story = {
  render: () => (
    <TableContainer>
      <Table variant="compact" size="sm">
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sampleUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>#{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ),
}

export const WithSorting: Story = {
  render: () => (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable sorted="asc">Name</TableHead>
            <TableHead sortable>Email</TableHead>
            <TableHead sortable sorted="desc">Join Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sampleUsers.map((user) => (
            <TableRow key={user.id} hover>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.joinDate}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">Edit</Button>
                  <Button variant="ghost" size="sm">Delete</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ),
}

export const WithFooter: Story = {
  render: () => (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Widget A</TableCell>
            <TableCell>2</TableCell>
            <TableCell>$10.00</TableCell>
            <TableCell>$20.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Widget B</TableCell>
            <TableCell>1</TableCell>
            <TableCell>$15.00</TableCell>
            <TableCell>$15.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Widget C</TableCell>
            <TableCell>3</TableCell>
            <TableCell>$8.00</TableCell>
            <TableCell>$24.00</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3} className="text-right font-semibold">
              Total:
            </TableCell>
            <TableCell className="font-bold">$59.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  ),
}

export const EmptyState: Story = {
  render: () => (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={4}>
              <TableEmptyState
                icon={<FiUser className="w-12 h-12 text-base-content/20" />}
                title="No users found"
                description="Get started by adding your first user"
                action={
                  <Button size="sm">
                    Add User
                  </Button>
                }
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  ),
}

export const WithComplexContent: Story = {
  render: () => (
    <TableContainer variant="elevated">
      <Table variant="zebra">
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Role & Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sampleUsers.map((user) => (
            <TableRow key={user.id} hover>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-8">
                      <span className="text-xs">{user.name.charAt(0)}</span>
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">{user.name}</div>
                    <div className="text-sm opacity-50">#{user.id}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <FiMail className="w-4 h-4 text-base-content/50" />
                  {user.email}
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <Badge variant={user.role === 'Admin' ? 'destructive' : user.role === 'Editor' ? 'nps' : 'feature'}>
                    {user.role}
                  </Badge>
                  <div>
                    <Badge size="sm" variant={user.status === 'Active' ? 'general' : 'outline'}>
                      {user.status}
                    </Badge>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <FiCalendar className="w-4 h-4 text-base-content/50" />
                  {user.joinDate}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm">
                    <FiMoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ),
}

export const Responsive: Story = {
  render: () => (
    <div className="w-full max-w-sm mx-auto">
      <TableContainer overflow="auto">
        <Table size="sm">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleUsers.slice(0, 2).map((user) => (
              <TableRow key={user.id} hover>
                <TableCell className="whitespace-nowrap">{user.name}</TableCell>
                <TableCell className="whitespace-nowrap">{user.email}</TableCell>
                <TableCell className="whitespace-nowrap">{user.role}</TableCell>
                <TableCell className="whitespace-nowrap">{user.status}</TableCell>
                <TableCell className="whitespace-nowrap">{user.joinDate}</TableCell>
                <TableCell className="whitespace-nowrap">
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  ),
}