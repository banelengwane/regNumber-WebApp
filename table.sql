drop TABLE if exists towns;
drop TABLE if exists regsTb;
create table towns(
	id serial not null primary key,
	town text not null,
	startStr text not null
);

create table regsTb(
	id serial not null primary key,
	regNumber text not null,
	town_id int,
    foreign key (town_id) references towns(id)
);

insert into towns (town, startStr) values ('cape town', 'CA');
insert into towns (town, startStr) values ('bellville', 'CY');
insert into towns (town, startStr) values ('paarl', 'CJ');
