import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { searchUsers } from "@/actions/users";
import { UserTableActions } from "@/components/users/UserTableActions";
import { UserSearchFilter } from "@/components/users/UserSearchFilter";
import { Pagination } from "@/components/dashboard/Pagination";
import { Users, Mail, Phone, MapPin, Wallet } from "lucide-react";
import { getSession } from "@/actions/session";
import { isAdminRole } from "@/utils/permissions";

interface UsersPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
  }>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  // Check if user is admin
  const { user } = await getSession();
  if (!user || !isAdminRole(user.role)) {
    redirect("/dashboard");
  }

  const sp = await searchParams;
  const page = sp.page || "1";
  const limit = sp.limit || "30";
  const search = sp.search || "";

  const usersData = await searchUsers({ page, limit, search });
  const { pagination } = usersData;
  const users = usersData.data || [];
  const totalUsers = pagination?.totalUser || 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (firstName?: string, lastName?: string, email?: string) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (firstName) {
      return firstName.charAt(0).toUpperCase();
    }
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    return "U";
  };

  const getUserName = (firstName?: string, lastName?: string, email?: string) => {
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    if (firstName) {
      return firstName;
    }
    if (lastName) {
      return lastName;
    }
    return email || "N/A";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage and monitor all registered users</p>
        </div>
      </div>

      {/* Search Filter */}
      <UserSearchFilter />

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Users List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md ">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead className="text-center">Wallet Points</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="h-8 w-8 text-muted-foreground" />
                        <div className="text-sm text-muted-foreground">
                          {search ? `No users found for "${search}"` : "No users found"}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user: any) => (
                    <TableRow key={user._id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={user.img?.url}
                              alt={getUserName(user.first_name, user.last_name, user.email)}
                            />
                            <AvatarFallback>
                              {getInitials(user.first_name, user.last_name, user.email)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <div className="font-medium">
                              {getUserName(user.first_name, user.last_name, user.email)}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              <span className="truncate max-w-[180px]">{user.email}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.phone ? (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span>{user.phone}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.address && user.address.length > 0 ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span className="truncate max-w-[150px]">
                                {user.address[0].city}, {user.address[0].state}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              PIN: {user.address[0].pincode}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="capitalize text-sm">{user.gender || "N/A"}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Wallet className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">{user.wallet_point || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={user.isActive ? "default" : "secondary"}>
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatDate(user.createdAt)}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <UserTableActions user={user} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <Pagination
        page={parseInt(page)}
        totalPages={pagination?.totalPages || 0}
        totalItems={totalUsers}
        itemLabel="user"
        useUrlNavigation={true}
      />
    </div>
  );
}
