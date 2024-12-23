USE [master]
GO
/****** Object:  Database [Keells]    Script Date: 12/19/2024 7:07:05 AM ******/
CREATE DATABASE [Keells]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'Keells', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\Keells.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'Keells_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\Keells_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [Keells] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [Keells].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [Keells] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [Keells] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [Keells] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [Keells] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [Keells] SET ARITHABORT OFF 
GO
ALTER DATABASE [Keells] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [Keells] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [Keells] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [Keells] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [Keells] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [Keells] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [Keells] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [Keells] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [Keells] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [Keells] SET  DISABLE_BROKER 
GO
ALTER DATABASE [Keells] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [Keells] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [Keells] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [Keells] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [Keells] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [Keells] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [Keells] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [Keells] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [Keells] SET  MULTI_USER 
GO
ALTER DATABASE [Keells] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [Keells] SET DB_CHAINING OFF 
GO
ALTER DATABASE [Keells] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [Keells] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [Keells] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [Keells] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [Keells] SET QUERY_STORE = ON
GO
ALTER DATABASE [Keells] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [Keells]
GO
/****** Object:  Table [dbo].[Departments]    Script Date: 12/19/2024 7:07:06 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Departments](
	[DepartmentId] [int] IDENTITY(1,1) NOT NULL,
	[DepartmentCode] [nvarchar](50) NOT NULL,
	[DepartmentName] [nvarchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[DepartmentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Employees]    Script Date: 12/19/2024 7:07:06 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Employees](
	[EmployeeId] [int] IDENTITY(1,1) NOT NULL,
	[FirstName] [nvarchar](100) NOT NULL,
	[LastName] [nvarchar](100) NOT NULL,
	[Email] [nvarchar](255) NOT NULL,
	[DateOfBirth] [date] NOT NULL,
	[Age]  AS (datediff(year,[DateOfBirth],getdate())),
	[Salary] [decimal](18, 2) NOT NULL,
	[DepartmentId] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[EmployeeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Departments] ON 

INSERT [dbo].[Departments] ([DepartmentId], [DepartmentCode], [DepartmentName]) VALUES (1, N'IT', N'Information Technology')
INSERT [dbo].[Departments] ([DepartmentId], [DepartmentCode], [DepartmentName]) VALUES (5, N'HR', N'Human Resources')
INSERT [dbo].[Departments] ([DepartmentId], [DepartmentCode], [DepartmentName]) VALUES (22, N'FIN', N'Finance')
INSERT [dbo].[Departments] ([DepartmentId], [DepartmentCode], [DepartmentName]) VALUES (23, N'MKT', N'Marketing')
INSERT [dbo].[Departments] ([DepartmentId], [DepartmentCode], [DepartmentName]) VALUES (24, N'R&D', N'Research and Development')
INSERT [dbo].[Departments] ([DepartmentId], [DepartmentCode], [DepartmentName]) VALUES (25, N'QA', N'Quality Assurance')
INSERT [dbo].[Departments] ([DepartmentId], [DepartmentCode], [DepartmentName]) VALUES (26, N'LEG', N'Legal')
SET IDENTITY_INSERT [dbo].[Departments] OFF
GO
SET IDENTITY_INSERT [dbo].[Employees] ON 

INSERT [dbo].[Employees] ([EmployeeId], [FirstName], [LastName], [Email], [DateOfBirth], [Salary], [DepartmentId]) VALUES (2, N'Anjana', N'Tharusha', N'anjana@gmail.com', CAST(N'2000-07-20' AS Date), CAST(150000.00 AS Decimal(18, 2)), 1)
INSERT [dbo].[Employees] ([EmployeeId], [FirstName], [LastName], [Email], [DateOfBirth], [Salary], [DepartmentId]) VALUES (12, N'Thilina', N'Kumaraswami', N'thilina@gmail.com', CAST(N'1992-02-11' AS Date), CAST(85000.45 AS Decimal(18, 2)), 22)
INSERT [dbo].[Employees] ([EmployeeId], [FirstName], [LastName], [Email], [DateOfBirth], [Salary], [DepartmentId]) VALUES (13, N'Janaki', N'Rathnayake', N'janaki@keells.lk', CAST(N'1985-07-31' AS Date), CAST(98000.00 AS Decimal(18, 2)), 5)
INSERT [dbo].[Employees] ([EmployeeId], [FirstName], [LastName], [Email], [DateOfBirth], [Salary], [DepartmentId]) VALUES (14, N'Malka', N'Sandun', N'malka@gmail.com', CAST(N'2001-09-19' AS Date), CAST(55000.00 AS Decimal(18, 2)), 23)
INSERT [dbo].[Employees] ([EmployeeId], [FirstName], [LastName], [Email], [DateOfBirth], [Salary], [DepartmentId]) VALUES (15, N'Kelum', N'Perera', N'kelum@gmail.com', CAST(N'1993-05-15' AS Date), CAST(145000.00 AS Decimal(18, 2)), 24)
SET IDENTITY_INSERT [dbo].[Employees] OFF
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Departme__6EA8896D7405CF81]    Script Date: 12/19/2024 7:07:06 AM ******/
ALTER TABLE [dbo].[Departments] ADD UNIQUE NONCLUSTERED 
(
	[DepartmentCode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__Employee__A9D10534FF0F3BE3]    Script Date: 12/19/2024 7:07:06 AM ******/
ALTER TABLE [dbo].[Employees] ADD UNIQUE NONCLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Employees]  WITH CHECK ADD FOREIGN KEY([DepartmentId])
REFERENCES [dbo].[Departments] ([DepartmentId])
GO
ALTER TABLE [dbo].[Employees]  WITH CHECK ADD  CONSTRAINT [CK_DateOfBirth_PreventFutureDate] CHECK  (([DateOfBirth]<=getdate()))
GO
ALTER TABLE [dbo].[Employees] CHECK CONSTRAINT [CK_DateOfBirth_PreventFutureDate]
GO
ALTER TABLE [dbo].[Employees]  WITH CHECK ADD  CONSTRAINT [CK_Salary_NonNegative] CHECK  (([Salary]>=(0)))
GO
ALTER TABLE [dbo].[Employees] CHECK CONSTRAINT [CK_Salary_NonNegative]
GO
USE [master]
GO
ALTER DATABASE [Keells] SET  READ_WRITE 
GO
