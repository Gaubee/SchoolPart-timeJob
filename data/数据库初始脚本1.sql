if exists (select * from sysobjects where id = OBJECT_ID('[MessageBox]') and OBJECTPROPERTY(id, 'IsUserTable') = 1) 
DROP TABLE [MessageBox]

CREATE TABLE [MessageBox] (
[Id] [int]  IDENTITY (1, 1)  NOT NULL,
[CreateTime] [datetime]  NOT NULL DEFAULT getdate,
[AutherUserId] [int]  NOT NULL,
[contents] [text]  NOT NULL,
[SonUserId] [int]  NOT NULL)

ALTER TABLE [MessageBox] WITH NOCHECK ADD  CONSTRAINT [PK_MessageBox] PRIMARY KEY  NONCLUSTERED ( [Id] )
SET IDENTITY_INSERT [MessageBox] ON


SET IDENTITY_INSERT [MessageBox] OFF
if exists (select * from sysobjects where id = OBJECT_ID('[Notice]') and OBJECTPROPERTY(id, 'IsUserTable') = 1) 
DROP TABLE [Notice]

CREATE TABLE [Notice] (
[Id] [int]  IDENTITY (1, 1)  NOT NULL,
[CreateTime] [datetime]  NOT NULL DEFAULT getdate,
[contents] [text]  NOT NULL,
[AutherUserId] [int]  NOT NULL)

ALTER TABLE [Notice] WITH NOCHECK ADD  CONSTRAINT [PK_Notice] PRIMARY KEY  NONCLUSTERED ( [Id] )
SET IDENTITY_INSERT [Notice] ON


SET IDENTITY_INSERT [Notice] OFF
if exists (select * from sysobjects where id = OBJECT_ID('[Record]') and OBJECTPROPERTY(id, 'IsUserTable') = 1) 
DROP TABLE [Record]

CREATE TABLE [Record] (
[Id] [int]  IDENTITY (1, 1)  NOT NULL,
[CreateTime] [datetime]  NOT NULL DEFAULT getdate,
[performer] [nvarchar]  (30) NOT NULL,
[action] [nchar]  (20) NOT NULL,
[target] [nchar]  (30) NOT NULL,
[other] [text]  NULL)

ALTER TABLE [Record] WITH NOCHECK ADD  CONSTRAINT [PK_Record] PRIMARY KEY  NONCLUSTERED ( [Id] )
SET IDENTITY_INSERT [Record] ON


SET IDENTITY_INSERT [Record] OFF
if exists (select * from sysobjects where id = OBJECT_ID('[Sign]') and OBJECTPROPERTY(id, 'IsUserTable') = 1) 
DROP TABLE [Sign]

CREATE TABLE [Sign] (
[Id] [int]  IDENTITY (1, 1)  NOT NULL,
[BeginTime] [datetime]  NOT NULL DEFAULT getdate,
[EndTime] [datetime]  NOT NULL DEFAULT getdate,
[TheacherUserId] [int]  NOT NULL,
[StudentUserId] [int]  NOT NULL,
[Gain] [int]  NOT NULL DEFAULT 0,
[other] [text]  NULL)

ALTER TABLE [Sign] WITH NOCHECK ADD  CONSTRAINT [PK_Sign] PRIMARY KEY  NONCLUSTERED ( [Id] )
SET IDENTITY_INSERT [Sign] ON


SET IDENTITY_INSERT [Sign] OFF
if exists (select * from sysobjects where id = OBJECT_ID('[StudentMessage]') and OBJECTPROPERTY(id, 'IsUserTable') = 1) 
DROP TABLE [StudentMessage]

CREATE TABLE [StudentMessage] (
[Id] [int]  IDENTITY (1, 1)  NOT NULL,
[SunOfWorkTime] [int]  NOT NULL DEFAULT 0,
[SignTimes] [int]  NOT NULL DEFAULT 0,
[ThisSunOfWorkTime] [int]  NOT NULL DEFAULT 0,
[ThisSignTimes] [int]  NOT NULL DEFAULT 0,
[Score] [int]  NOT NULL DEFAULT 0,
[Evaluate] [int]  NOT NULL DEFAULT 0,
[CreateTime] [datetime]  NOT NULL DEFAULT getdate,
[WorkIng] [int]  NOT NULL DEFAULT 0,
[LoginIng] [int]  NOT NULL DEFAULT 0)

ALTER TABLE [StudentMessage] WITH NOCHECK ADD  CONSTRAINT [PK_StudentMessage] PRIMARY KEY  NONCLUSTERED ( [Id] )
SET IDENTITY_INSERT [StudentMessage] ON


SET IDENTITY_INSERT [StudentMessage] OFF
if exists (select * from sysobjects where id = OBJECT_ID('[TeacherMessage]') and OBJECTPROPERTY(id, 'IsUserTable') = 1) 
DROP TABLE [TeacherMessage]

CREATE TABLE [TeacherMessage] (
[Id] [int]  IDENTITY (1, 1)  NOT NULL,
[UseSign] [int]  NOT NULL DEFAULT 0,
[CreateTime] [datetime]  NOT NULL DEFAULT getdate)

ALTER TABLE [TeacherMessage] WITH NOCHECK ADD  CONSTRAINT [PK_TeacherMessage] PRIMARY KEY  NONCLUSTERED ( [Id] )
SET IDENTITY_INSERT [TeacherMessage] ON


SET IDENTITY_INSERT [TeacherMessage] OFF
if exists (select * from sysobjects where id = OBJECT_ID('[User]') and OBJECTPROPERTY(id, 'IsUserTable') = 1) 
DROP TABLE [User]

CREATE TABLE [User] (
[id] [int]  IDENTITY (1, 1)  NOT NULL,
[Rank] [int]  NOT NULL DEFAULT 3,
[Name] [nchar]  (20) NOT NULL,
[Password] [nchar]  (30) NOT NULL DEFAULT '111111',
[UserMessageId] [int]  NOT NULL,
[ParentId] [int]  NOT NULL,
[RegisterNum] [int]  NOT NULL,
[CreateTime] [datetime]  NOT NULL DEFAULT getdate,
[LastLoginTime] [datetime]  NOT NULL DEFAULT getdate)

ALTER TABLE [User] WITH NOCHECK ADD  CONSTRAINT [PK_User] PRIMARY KEY  NONCLUSTERED ( [id] )
SET IDENTITY_INSERT [User] ON


SET IDENTITY_INSERT [User] OFF
