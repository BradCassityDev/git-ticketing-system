USE git_ticketing_db;

INSERT INTO User_State (name)
VALUES
  ('Active'),
  ('Inactive');

INSERT INTO Project_State (name)
VALUES
  ('Active'),
  ('Inactive');

INSERT INTO Issue_State (name)
VALUES
  ('Opened'),
  ('In Progress'),
  ('Blocked'),
  ('Closed');
  
INSERT INTO Role (name)
VALUES
  ('Developer'),
  ('Admin');