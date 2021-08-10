--
-- PostgreSQL database dump
--

-- Dumped from database version 12.5
-- Dumped by pg_dump version 12.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE idh_ipd;
--
-- Name: idh_ipd; Type: DATABASE; Schema: -; Owner: ipd
--

CREATE DATABASE idh_ipd WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8';


ALTER DATABASE idh_ipd OWNER TO ipd;

\connect idh_ipd

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: di_status; Type: TYPE; Schema: public; Owner: ipd
--

CREATE TYPE public.di_status AS ENUM (
    'current',
    'feasible'
);


ALTER TYPE public.di_status OWNER TO ipd;

--
-- Name: driverincomestatus; Type: TYPE; Schema: public; Owner: ipd
--

CREATE TYPE public.driverincomestatus AS ENUM (
    'feasible',
    'current'
);


ALTER TYPE public.driverincomestatus OWNER TO ipd;

--
-- Name: userrole; Type: TYPE; Schema: public; Owner: ipd
--

CREATE TYPE public.userrole AS ENUM (
    'user',
    'admin'
);


ALTER TYPE public.userrole OWNER TO ipd;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: access; Type: TABLE; Schema: public; Owner: ipd
--

CREATE TABLE public.access (
    id integer NOT NULL,
    "user" integer,
    company integer
);


ALTER TABLE public.access OWNER TO ipd;

--
-- Name: access_id_seq; Type: SEQUENCE; Schema: public; Owner: ipd
--

CREATE SEQUENCE public.access_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.access_id_seq OWNER TO ipd;

--
-- Name: access_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ipd
--

ALTER SEQUENCE public.access_id_seq OWNED BY public.access.id;


--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: ipd
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO ipd;

--
-- Name: company; Type: TABLE; Schema: public; Owner: ipd
--

CREATE TABLE public.company (
    id integer NOT NULL,
    name character varying,
    country integer,
    crop integer,
    land_size double precision,
    price double precision,
    yields integer,
    prod_cost integer,
    other_income integer,
    living_income integer,
    net_income integer,
    hh_income integer
);


ALTER TABLE public.company OWNER TO ipd;

--
-- Name: company_id_seq; Type: SEQUENCE; Schema: public; Owner: ipd
--

CREATE SEQUENCE public.company_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.company_id_seq OWNER TO ipd;

--
-- Name: company_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ipd
--

ALTER SEQUENCE public.company_id_seq OWNED BY public.company.id;


--
-- Name: country; Type: TABLE; Schema: public; Owner: ipd
--

CREATE TABLE public.country (
    id integer NOT NULL,
    name character varying,
    code character varying
);


ALTER TABLE public.country OWNER TO ipd;

--
-- Name: country_id_seq; Type: SEQUENCE; Schema: public; Owner: ipd
--

CREATE SEQUENCE public.country_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.country_id_seq OWNER TO ipd;

--
-- Name: country_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ipd
--

ALTER SEQUENCE public.country_id_seq OWNED BY public.country.id;


--
-- Name: crop; Type: TABLE; Schema: public; Owner: ipd
--

CREATE TABLE public.crop (
    id integer NOT NULL,
    name character varying
);


ALTER TABLE public.crop OWNER TO ipd;

--
-- Name: crop_id_seq; Type: SEQUENCE; Schema: public; Owner: ipd
--

CREATE SEQUENCE public.crop_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.crop_id_seq OWNER TO ipd;

--
-- Name: crop_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ipd
--

ALTER SEQUENCE public.crop_id_seq OWNED BY public.crop.id;


--
-- Name: driver_income; Type: TABLE; Schema: public; Owner: ipd
--

CREATE TABLE public.driver_income (
    id integer NOT NULL,
    country integer,
    crop integer,
    status public.di_status,
    area double precision,
    price double precision,
    cop_pha integer,
    cop_pkg double precision,
    efficiency integer,
    yields integer,
    diversification integer,
    revenue integer,
    total_revenue integer,
    net_income integer,
    living_income integer,
    source text
);


ALTER TABLE public.driver_income OWNER TO ipd;

--
-- Name: driver_income_id_seq; Type: SEQUENCE; Schema: public; Owner: ipd
--

CREATE SEQUENCE public.driver_income_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.driver_income_id_seq OWNER TO ipd;

--
-- Name: driver_income_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ipd
--

ALTER SEQUENCE public.driver_income_id_seq OWNED BY public.driver_income.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: ipd
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    email character varying,
    role public.userrole,
    created timestamp without time zone
);


ALTER TABLE public."user" OWNER TO ipd;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: ipd
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO ipd;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ipd
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: access id; Type: DEFAULT; Schema: public; Owner: ipd
--

ALTER TABLE ONLY public.access ALTER COLUMN id SET DEFAULT nextval('public.access_id_seq'::regclass);


--
-- Name: company id; Type: DEFAULT; Schema: public; Owner: ipd
--

ALTER TABLE ONLY public.company ALTER COLUMN id SET DEFAULT nextval('public.company_id_seq'::regclass);


--
-- Name: country id; Type: DEFAULT; Schema: public; Owner: ipd
--

ALTER TABLE ONLY public.country ALTER COLUMN id SET DEFAULT nextval('public.country_id_seq'::regclass);


--
-- Name: crop id; Type: DEFAULT; Schema: public; Owner: ipd
--

ALTER TABLE ONLY public.crop ALTER COLUMN id SET DEFAULT nextval('public.crop_id_seq'::regclass);


--
-- Name: driver_income id; Type: DEFAULT; Schema: public; Owner: ipd
--

ALTER TABLE ONLY public.driver_income ALTER COLUMN id SET DEFAULT nextval('public.driver_income_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: ipd
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Data for Name: access; Type: TABLE DATA; Schema: public; Owner: ipd
--

COPY public.access (id, "user", company) FROM stdin;
\.


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: ipd
--

COPY public.alembic_version (version_num) FROM stdin;
113a4b4b1aef
\.


--
-- Data for Name: company; Type: TABLE DATA; Schema: public; Owner: ipd
--

COPY public.company (id, name, country, crop, land_size, price, yields, prod_cost, other_income, living_income, net_income, hh_income) FROM stdin;
\.


--
-- Data for Name: country; Type: TABLE DATA; Schema: public; Owner: ipd
--

COPY public.country (id, name, code) FROM stdin;
1	Antarctica	1055
2	Bassas da India (Fr.)	1017
3	Europa Island (Fr.)	1025
4	French Southern Territories (Fr.)	1097
5	Glorioso Islands (Fr.)	1082
6	Juan de Nova Island (Fr.)	1034
7	Tromelin Island (Fr.)	1047
8	Ashmore & Cartier Is. (Aust.)	1015
9	Saba (Neth.)	1068
10	Sint Eustatius (Neth.)	1069
11	Bouvet Island	1019
12	Canary Islands (Sp.)	1012
13	Chagos Archipelago (Mauritius)	1080
14	Azores Islands (Port.)	1011
15	Madeira Islands (Port.)	1038
16	Gaza	1027
17	West Bank	1049
18	Clipperton Island	1023
19	Baker Island (USA)	1016
20	Howland Island (USA)	1031
21	Jarvis Island (USA)	1032
22	Johnston Atoll (USA)	1033
23	Kingman Reef (USA)	1035
24	Midway Islands (USA)	1039
25	Navassa Island (USA)	1040
26	Palmyra Atoll (USA)	1041
27	Wake Island (USA)	1048
28	Abyei	1029
29	Jammu and Kashmir **	1052
30	Akrotiri (S.B.A.)	1098
31	Dekelia (S.B.A.)	1099
32	Aruba (Neth.)	533
33	Afghanistan	4
34	Angola	24
35	Åland Islands	248
36	Albania	8
37	Andorra	20
38	United Arab Emirates	784
39	Argentina	32
40	Armenia	51
41	American Samoa *	16
42	Antigua and Barbuda	28
43	Australia	36
44	Austria	40
45	Azerbaijan	31
46	Burundi	108
47	Belgium	56
48	Benin	204
49	Bonaire (Neth.)	535
50	Burkina Faso	854
51	Bangladesh	50
52	Bulgaria	100
53	Bahrain	48
54	Bahamas	44
55	Bosnia and Herzegovina	70
56	Saint Barthélemy (Fr.)	652
57	Belarus	112
58	Belize	84
59	Bermuda *	60
60	Bolivia (Plurinational State of)	68
61	Brazil	76
62	Barbados	52
63	Brunei Darussalam	96
64	Bhutan	64
65	Botswana	72
66	Central African Republic	140
67	Canada	124
68	Cocos (Keeling) Is. (Aust.)	166
69	Switzerland	756
70	Chile	152
71	China	156
72	Côte d'Ivoire	384
73	Cameroon	120
74	Democratic Republic of the Congo	180
75	Congo	178
76	Cook Islands	184
77	Colombia	170
78	Comoros	174
79	Cape Verde	132
80	Costa Rica	188
81	Cuba	192
82	Curaçao (Neth.)	531
83	Christmas Is. (Aust.)	162
84	Cayman Islands *	136
85	Cyprus	196
86	Czechia	203
87	Germany	276
88	Djibouti	262
89	Dominica	212
90	Denmark	208
91	Dominican Republic	214
92	Algeria	12
93	Ecuador	218
94	Egypt	818
95	Eritrea	232
96	Western Sahara *	732
97	Spain	724
98	Estonia	233
99	Ethiopia	231
100	Finland	246
101	Fiji	242
102	Falkland Islands (Malvinas) ***	238
103	France	250
104	Faroe Islands (Denmark)	234
105	Micronesia (Federated States of)	583
106	Gabon	266
107	United Kingdom of Great Britain & Northern Ireland	826
108	Georgia	268
109	Guernsey (UK)	831
110	Ghana	288
111	Gibraltar *	292
112	Guinea	324
113	Guadeloupe (Fr.)	312
114	Gambia	270
115	Guinea-Bissau	624
116	Equatorial Guinea	226
117	Greece	300
118	Grenada	308
119	Greenland (Denmark)	304
120	Guatemala	320
121	French Guiana (Fr.)	254
122	Guam *	316
123	Guyana	328
124	Heard Is. & McDonald Is. (Aust.)	334
125	Honduras	340
126	Croatia	191
127	Haiti	332
128	Hungary	348
129	Indonesia	360
130	Isle of Man (UK)	833
131	India	356
132	Ireland	372
133	Iran (Islamic Republic of)	364
134	Iraq	368
135	Iceland	352
136	Israel	376
137	Italy	380
138	Jamaica	388
139	Jersey (UK)	832
140	Jordan	400
141	Japan	392
142	Kazakhstan	398
143	Kenya	404
144	Kyrgyzstan	417
145	Cambodia	116
146	Kiribati	296
147	Saint Kitts and Nevis	659
148	Republic of Korea	410
149	Kuwait	414
150	Lao People's Democratic Republic	418
151	Lebanon	422
152	Liberia	430
153	Libya	434
154	Saint Lucia	662
155	Liechtenstein	438
156	Sri Lanka	144
157	Lesotho	426
158	Lithuania	440
159	Luxembourg	442
160	Latvia	428
161	Saint Martin (Fr.)	663
162	Morocco	504
163	Monaco	492
164	Moldova	498
165	Madagascar	450
166	Maldives	462
167	Mexico	484
168	Marshall Islands	584
169	North Macedonia	807
170	Mali	466
171	Malta	470
172	Myanmar	104
173	Montenegro	499
174	Mongolia	496
175	Northern Mariana Is. (USA)	580
176	Mozambique	508
177	Mauritania	478
178	Montserrat *	500
179	Martinique (Fr.)	474
180	Mauritius	480
181	Malawi	454
182	Malaysia	458
183	Mayotte	175
184	Namibia	516
185	New Caledonia *	540
186	Niger	562
187	Norfolk Island (Aust.)	574
188	Nigeria	566
189	Nicaragua	558
190	Niue	570
191	Netherlands	528
192	Norway	578
193	Nepal	524
194	Nauru	520
195	New Zealand	554
196	Oman	512
197	Pakistan	586
198	Panama	591
199	Pitcairn *	612
200	Peru	604
201	Philippines	608
202	Palau	585
203	Papua New Guinea	598
204	Poland	616
205	Puerto Rico (USA)	630
206	Democratic People's Republic of Korea	408
207	Portugal	620
208	Paraguay	600
209	French Polynesia *	258
210	Qatar	634
211	Réunion (Fr.)	638
212	Romania	642
213	Russian Federation	643
214	Rwanda	646
215	Saudi Arabia	682
216	Sudan	729
217	Senegal	686
218	Singapore	702
219	South Georgia and the South Sandwich Is.	239
220	Ascencion *	1059
221	Gough *	1101
222	Saint Helena *	654
223	Tristan da Cunha *	1060
224	Svalbard & Jan Mayen Is. (Norw.)	744
225	Solomon Islands	90
226	Sierra Leone	694
227	El Salvador	222
228	San Marino	674
229	Somalia	706
230	Saint Pierre et Miquelon (Fr.)	666
231	Serbia	688
232	South Sudan	728
233	Sao Tome and Principe	678
234	Suriname	740
235	Slovakia	703
236	Slovenia	705
237	Sweden	752
238	Eswatini	748
239	Sint Maarten (Neth.)	534
240	Seychelles	690
241	Syrian Arab Republic	760
242	Chad	148
243	Togo	768
244	Thailand	764
245	Tajikistan	762
246	Tokelau *	772
247	Turkmenistan	795
248	Timor-Leste	626
249	Tonga	776
250	Trinidad and Tobago	780
251	Tunisia	788
252	Turkey	792
253	Tuvalu	798
254	United Republic of Tanzania	834
255	Uganda	800
256	Ukraine	804
257	Uruguay	858
258	United States of America	840
259	Uzbekistan	860
260	Holy See	336
261	Saint Vincent and the Grenadines	670
262	Venezuela	862
263	British Virgin Islands *	92
264	United States Virgin Islands *	850
265	Viet Nam	704
266	Vanuatu	548
267	Samoa	882
268	Yemen	887
269	South Africa	710
270	Zambia	894
271	Zimbabwe	716
272	Anguilla *	660
273	Turks and Caicos Islands *	796
274	Hong Kong, China	344
275	Macao, China	446
276	Taiwan, Province of China	999
\.


--
-- Data for Name: crop; Type: TABLE DATA; Schema: public; Owner: ipd
--

COPY public.crop (id, name) FROM stdin;
1	Coffee
2	Cocoa
3	Tea
\.


--
-- Data for Name: driver_income; Type: TABLE DATA; Schema: public; Owner: ipd
--

COPY public.driver_income (id, country, crop, status, area, price, cop_pha, cop_pkg, efficiency, yields, diversification, revenue, total_revenue, net_income, living_income, source) FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: ipd
--

COPY public."user" (id, email, role, created) FROM stdin;
\.


--
-- Name: access_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ipd
--

SELECT pg_catalog.setval('public.access_id_seq', 1, false);


--
-- Name: company_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ipd
--

SELECT pg_catalog.setval('public.company_id_seq', 1, false);


--
-- Name: country_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ipd
--

SELECT pg_catalog.setval('public.country_id_seq', 276, true);


--
-- Name: crop_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ipd
--

SELECT pg_catalog.setval('public.crop_id_seq', 3, true);


--
-- Name: driver_income_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ipd
--

SELECT pg_catalog.setval('public.driver_income_id_seq', 1, false);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ipd
--

SELECT pg_catalog.setval('public.user_id_seq', 1, false);


--
-- Name: access access_pkey; Type: CONSTRAINT; Schema: public; Owner: ipd
--

ALTER TABLE ONLY public.access
    ADD CONSTRAINT access_pkey PRIMARY KEY (id);


--
-- Name: access access_user_company_key; Type: CONSTRAINT; Schema: public; Owner: ipd
--

ALTER TABLE ONLY public.access
    ADD CONSTRAINT access_user_company_key UNIQUE ("user", company);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: ipd
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: company company_name_key; Type: CONSTRAINT; Schema: public; Owner: ipd
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT company_name_key UNIQUE (name);


--
-- Name: company company_pkey; Type: CONSTRAINT; Schema: public; Owner: ipd
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT company_pkey PRIMARY KEY (id);


--
-- Name: country country_name_key; Type: CONSTRAINT; Schema: public; Owner: ipd
--

ALTER TABLE ONLY public.country
    ADD CONSTRAINT country_name_key UNIQUE (name);


--
-- Name: country country_pkey; Type: CONSTRAINT; Schema: public; Owner: ipd
--

ALTER TABLE ONLY public.country
    ADD CONSTRAINT country_pkey PRIMARY KEY (id);


--
-- Name: crop crop_name_key; Type: CONSTRAINT; Schema: public; Owner: ipd
--

ALTER TABLE ONLY public.crop
    ADD CONSTRAINT crop_name_key UNIQUE (name);


--
-- Name: crop crop_pkey; Type: CONSTRAINT; Schema: public; Owner: ipd
--

ALTER TABLE ONLY public.crop
    ADD CONSTRAINT crop_pkey PRIMARY KEY (id);


--
-- Name: driver_income driver_income_country_crop_status_key; Type: CONSTRAINT; Schema: public; Owner: ipd
--

ALTER TABLE ONLY public.driver_income
    ADD CONSTRAINT driver_income_country_crop_status_key UNIQUE (country, crop, status);


--
-- Name: driver_income driver_income_pkey; Type: CONSTRAINT; Schema: public; Owner: ipd
--

ALTER TABLE ONLY public.driver_income
    ADD CONSTRAINT driver_income_pkey PRIMARY KEY (id);


--
-- Name: user user_email_key; Type: CONSTRAINT; Schema: public; Owner: ipd
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: ipd
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: ix_access_id; Type: INDEX; Schema: public; Owner: ipd
--

CREATE UNIQUE INDEX ix_access_id ON public.access USING btree (id);


--
-- Name: ix_company_id; Type: INDEX; Schema: public; Owner: ipd
--

CREATE UNIQUE INDEX ix_company_id ON public.company USING btree (id);


--
-- Name: ix_country_id; Type: INDEX; Schema: public; Owner: ipd
--

CREATE UNIQUE INDEX ix_country_id ON public.country USING btree (id);


--
-- Name: ix_crop_id; Type: INDEX; Schema: public; Owner: ipd
--

CREATE UNIQUE INDEX ix_crop_id ON public.crop USING btree (id);


--
-- Name: ix_driver_income_id; Type: INDEX; Schema: public; Owner: ipd
--

CREATE UNIQUE INDEX ix_driver_income_id ON public.driver_income USING btree (id);


--
-- Name: ix_user_id; Type: INDEX; Schema: public; Owner: ipd
--

CREATE UNIQUE INDEX ix_user_id ON public."user" USING btree (id);


--
-- Name: access access_company_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ipd
--

ALTER TABLE ONLY public.access
    ADD CONSTRAINT access_company_fkey FOREIGN KEY (company) REFERENCES public.company(id);


--
-- Name: access access_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ipd
--

ALTER TABLE ONLY public.access
    ADD CONSTRAINT access_user_fkey FOREIGN KEY ("user") REFERENCES public."user"(id);


--
-- Name: company company_country_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ipd
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT company_country_fkey FOREIGN KEY (country) REFERENCES public.country(id);


--
-- Name: company company_crop_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ipd
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT company_crop_fkey FOREIGN KEY (crop) REFERENCES public.crop(id);


--
-- Name: driver_income driver_income_country_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ipd
--

ALTER TABLE ONLY public.driver_income
    ADD CONSTRAINT driver_income_country_fkey FOREIGN KEY (country) REFERENCES public.country(id);


--
-- Name: driver_income driver_income_crop_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ipd
--

ALTER TABLE ONLY public.driver_income
    ADD CONSTRAINT driver_income_crop_fkey FOREIGN KEY (crop) REFERENCES public.crop(id);


--
-- PostgreSQL database dump complete
--

