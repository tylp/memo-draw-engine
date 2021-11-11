enum DrawPermission {
  All,
  Slave,
  Master,
}

interface PermissionParameter {
  type: DrawPermission,
}

export { DrawPermission, PermissionParameter };
