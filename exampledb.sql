
USE exampledb;

show tables;


SELECT * FROM Userinfos;
SELECT * FROM userPermissions;
SELECT * FROM userTypes;
SELECT * FROM workOrderAssignments;
SELECT * FROM Workorders;
SELECT * FROM Permissions;

drop table workOrderAssignments;
drop table Workorders;
drop table Userinfos;
drop table userPermissions;

INSERT INTO Permissions (permission, createdAt, updatedAt) VALUES ("CREATE-USERS", '2008-11-11', '2008-11-11');
INSERT INTO Permissions (permission, createdAt, updatedAt) VALUES ("ASSIGN-TASKS", '2008-11-11', '2008-11-11');
INSERT INTO Permissions (permission, createdAt, updatedAt) VALUES ("VIEW-WORK-ORDERS", '2008-11-11', '2008-11-11');

INSERT INTO UserTypes (type, defaultPermissions, createdAt, updatedAt) VALUES ("SUPERVISOR", "2,3", '2008-11-11', '2008-11-11');
INSERT INTO UserTypes (type, defaultPermissions, createdAt, updatedAt) VALUES ("ADMIN", "1,2,3", '2008-11-11', '2008-11-11');
INSERT INTO UserTypes (type, defaultPermissions, createdAt, updatedAt) VALUES ("USER", "3", '2008-11-11', '2008-11-11');
