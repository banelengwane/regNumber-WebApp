create table towns(
	id serial not null primary key,
	town text not null,
	startStr text not null
);

create table regsTb(
	id serial not null primary key,
	regNumber text not null,
	town_id int,
    foreign key (town_id) references towns(id) on DELETE CASCADE
);

insert into towns (town, startStr) values ('cape town', 'ca');
insert into towns (town, startStr) values ('bellville', 'cy');
insert into towns (town, startStr) values ('paarl', 'cj');
