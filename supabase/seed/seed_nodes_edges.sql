
insert into public.nodes (slug, title, tags) values
  ('paper','کاغذ', '{material,fragile}'),
  ('fire','آتش', '{element,heat}'),
  ('glass','شیشه', '{material,fragile}'),
  ('ice','یخ', '{material,phase}'),
  ('rust','زنگ‌زدگی', '{process}'),
  ('truth','حقیقت', '{concept}'),
  ('rumor','شایعه', '{concept}');

insert into public.edges (from_id, to_text, reason) select id, 'آتش', 'می‌سوزد' from public.nodes where slug='paper';
insert into public.edges (from_id, to_text, reason) select id, 'آب', 'خراب/خمیر می‌شود' from public.nodes where slug='paper';
insert into public.edges (from_id, to_text, reason) select id, 'قیچی', 'بریدن و نابودی کارکرد' from public.nodes where slug='paper';

insert into public.edges (from_id, to_text, reason) select id, 'آب', 'خاموش می‌شود' from public.nodes where slug='fire';
insert into public.edges (from_id, to_text, reason) select id, 'اکسیژن‌گیری', 'خاموشی با حذف اکسیژن' from public.nodes where slug='fire';

insert into public.edges (from_id, to_text, reason) select id, 'چکش', 'شکستن' from public.nodes where slug='glass';
insert into public.edges (from_id, to_text, reason) select id, 'شوک حرارتی', 'ترک و شکست' from public.nodes where slug='glass';

insert into public.edges (from_id, to_text, reason) select id, 'گرما', 'ذوب' from public.nodes where slug='ice'];
insert into public.edges (from_id, to_text, reason) select id, 'نمک', 'کاهش نقطه انجماد' from public.nodes where slug='ice';

insert into public.edges (from_id, to_text, reason) select id, 'حقیقت', 'بی‌اعتبارسازی' from public.nodes where slug='rumor';
insert into public.edges (from_id, to_text, reason) select id, 'راستی‌آزمایی', 'افشا و شفافیت' from public.nodes where slug='rumor';
