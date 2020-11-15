# Git Ticketing System

> This application provides a start up that doesn’t have a large staff to take on support and be able to take in issues and have the internal team have the ability to take those tickets directly to GitHub. This application will provide a core hub that creates communication between the business owner and developers and customers which can increase productivity and minimize problems.

## Table of contents

- [User Stories](#user-stories)
  - [Business Owner](#business-owner)
  - [Developer](#developer)
  - [Client](#client)
  - [Administrator](#administrator)
- [Screenshots](#screenshots)
- [Technologies](#technologies)
- [Setup](#setup)
- [Features](#features)
- [Inspiration](#inspiration)
- [Contact](#contact)

## User Stories

We will expand GitHub’s existing functionality to create a core hub that creates communication between the business owner and developers which can increase productivity and minimize problems by providing the ability to track a more granular status, due date and priority. We will also provide a seamless environment to facilitate communication between developers and the customer to take in issues and have the internal team have the ability to take those tickets directly to GitHub.

### Business Owner

As a business owner of a SAAS company:

- I want to implement a standardized project management system for my development team that is tightly integrated with GitHub;
  So that I can increase productivity across all development teams and grow my business with better product(s) that meet my customers' needs.

As an open source software or non-profit provider:

- I want to provide a collaborative environment where developers can come together to work on our product;
  So that we can continuously improve the product with better visibility and teamwork.

### Developer

As a developer working on a team:

- I want to track the status of each GitHub issue assigned to me in a more granular way than just "open/closed";
  So that I can better track my commitments and know how much work remains on any given project.
- I want to view a Kanban board of GitHub issues assigned to me;
  So that I can visually see my workload at a glance and ensure that no issues get overlooked.
- I want to view GitHub issues assigned to me with due dates;
  So that I can better manage my time in order to complete my tasks by their due date and help my team achieve success.
- I want to be able to flag an issue as 'blocked' when I am stuck;
  So that I can communicate with my manager and my team where I need help and remember to discuss it in our SCRUM.
<a href="https://drive.google.com/file/d/1ZsqjjI418RFCQKZ2edgInDGbDAAQ9SmB/view?usp=sharing" target=blank><strong>View Demo»</strong></a>

### Client

As the client of a software company:

- I want to be able to submit a support ticket when I encounter an error;
  So that my vender can improve the product I am using to better meet my needs.
- I want to be informed when an issue I submitted has been repaired;
  So that I know it has been resolved.
<a href="https://drive.google.com/file/d/1PkVNodR-_SFYzshy930jE3EjcrVASQzi/view?usp=sharing" target=blank><strong>View Demo»</strong></a>


### Administrator

As an administrator:

- I want to be able to create new users;
  So that those users can log in to the system.
- I want to be able to assign users to teams;
  So that their work can be organized within their team.
- I want to be able to deactivate users;
  So that their history is preserved, but they are unable to access the site.
- I want to be able to create teams;
  So that users can be assigned to those teams.
- I want to be able to create a project;
  So that a team can be assigned to it.
- I want to be able to review tickets from clients and enter valid items in GitHub assigned to my team;
  So that I can better connect my product development with my client's needs.
- I want to receive a text message/email when new tickets are submitted from a client;
  So that I can be aware of any urgent issues that need to be resolved.
<a href="https://drive.google.com/file/d/1ajnWOlqbuERJcHII_iXKAnSL6rxoCCJ6/view?usp=sharing" target=blank><strong>View Demo»</strong></a>

## Screenshots

![Example screenshot](./img/screenshot.png)

## Technologies

- Node.js
- Express.js
- Handlebars.js
- Nodemailer

## Setup

Describe how to install / setup your local environment / add link to demo version.

## Features

- Client ticketing window allows for a client to submit an issue and be informed when it has been resolved
- Developer Dashboard contains a Kanban board populated with GitHub issues for improved organization. The Kanban board allows for issues to be edited and color codes those with approaching due dates.
- Admin console allows for administrators to track projects in one location. They are able to view edit and create tasks, teams, projects and users in one place and have those changes post to GitHub.

To-do list:

- Allow developers to see tasks for entire team/project on the Developer Dashboard
- Allow administrators to assign tasks to users from the Developer Dashboard

## Inspiration

Project inspired by issues encountered in real world and class projects when using GitHub issues. Based on project work in teh University of Utah Web Coding Bootcamp such as Taskinator and Just Tech News.

## Contact

Created by [Brad Cassity](https://github.com/BradCassityDev), [Heather Everton](https://github.com/heather-everton), [Laurie Graff](https://github.com/LaurieGraff), [Jesse Parent](https://github.com/jesseparent), [Jared Rogerson](https://github.com/jrogerson20)
