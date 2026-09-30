export const jpTranslations: Record<string, string> = {
// PRUNED 2026-09-30 to the SAME key set as `translations.id` in i18n.ts — see the
// note there. 1714 -> 295 keys. A key present in one dictionary and not the
// other renders Indonesian to a Japanese reader, so the two must be pruned together.
    "ui.install_app": "アプリインストール",
    "ui.menu": "メニュー",
    "ui.close": "閉じる",
    "ui.language": "言語",
    // `ui.loader_title`, `ui.loader_msg`, `ui.force_close_loading` — removed with
    // `#global-loader`; see the note in i18n.ts.
    "ui.skip_to_content": "メインコンテンツへスキップ",

    // 却下理由コンポーザー (#12)
    "landing.class_badge": "新クラス募集",
    "landing.class_title": "K期生募集中",
    "landing.class_subtitle": "2026年10月開始",
    "landing.class_desc": "正規ルートで日本のキャリアを実現しましょう。特定期間（SSW）と研修（SO私営）プログラムを提供。1回あたり25-30名の限定枠で集中学習が可能です。",
    "landing.class_dana_title": "立替制度あり",
    "landing.class_dana_desc": "出発費用を無利息/無担保で立替可能。証明書/書類を担保としてLPKでいつでも確認可能。会社都合でのキャンセル時は全額返金（MCU除く）。",
    "landing.class_fee_title": "費用明細",
    "landing.class_fac_title": "無料寮完備",
    "landing.class_btn_wa": "WAグループ",
    "landing.class_btn_form": "生徒登録フォーム",
    "landing.visa_title": "ビザ手続き",
    "landing.visa_subtitle": "特定期間＆研修",
    "landing.visa_desc": "日本の文書・ビザ（TG＆研修）の作成を承ります。スラバヤ・ジャカルタ・メダン在住の方の書類作成に対応しています。",
    "landing.visa_btn": "ビザ相談",
    "landing.exam_title": "試験申込",
    "landing.exam_subtitle": "JFT基礎 & SSW Prometric",
    "landing.exam_desc": "試験スケジュールを素早く取得！インドネシア全会場（バンドン・ジャカルタ・スラバヤ・バリ等）のPrometricアカウント登録をお手伝いします。",
    "landing.exam_btn": "試験予約",
    "landing.maps_title": "LPK アマナサクラジャパン訪問",
  "landing.class_fac_kasur": "ベッド",
  "landing.class_fac_wifi": "WiFi",
  "landing.class_fac_dapur": "台所",
  "landing.class_fac_cuci": "洗濯",
  "landing.class_fac_motor": "バイク",
  "landing.class_fac_or": "OR",
  "landing.class_fac_note": "寮費のみ月額50,000ルピア",
  "landing.visa_list_1": "迅速＆信頼できるプロセス",
  "landing.visa_list_2": "手続きに準拠した正規申請",
  "landing.visa_list_3": "出発までの全面サポート",
  "landing.exam_list_1": "柔軟なスケジュール",
  "landing.exam_list_2": "インドネシア全土で受験可",
  "landing.exam_list_3": "試験対策サポート付き",

  // ── 会社概要：ヒーロー＋CTAバンド（ランディングページ L2） ──────────────
  // i18n.keys.test.ts の NS 一覧に `profile` があるため、下の全キーは
  // id / jp 両方の辞書で検証される。翻訳文の品質は追って改善してよいが、
  // キーの欠落は許されない（欠けると日本語ユーザーはインドネシア語に落ちる）。
  "profile.hero_eyebrow": "PT AMANAH SAKURA JAPAN",
  "profile.hero_tagline": "LET'S BUILD OUR FUTURE",
  "profile.hero_title": "日本でのキャリアは、ここから始まる。",
  "profile.hero_sub": "ポノロゴの日本語・就労文化訓練を行うLPKです。プログラム・求人・出発までのサポートを提供し、渡航は提携LPKおよびPT（SO）と共同で行います。",
  "profile.hero_cta_secondary": "応募者として登録",
  "profile.hero_chip_ssw": "特定技能",
  "profile.hero_chip_magang": "技能実習",
  "profile.hero_chip_penempatan": "就職支援",
  "profile.stat_since": "設立",
  "profile.stat_sectors": "職種",
  "profile.stat_prefectures": "都道府県",
  "profile.cta_title": "日本への一歩を、始めませんか。",
  "profile.cta_sub": "ご質問やご希望をお聞かせください。プログラム・費用・お申し込みの流れをご案内します。",
  "profile.cta_secondary": "応募者登録",

  // ── 会社概要：各セクション（ランディングページ L3） ──────────────────
  // キーは id 辞書と 1:1 で対応させること。欠けると i18n.keys.test.ts が赤くなる。
  // 固有名詞・番号・社名は翻訳しない（i18n.ts 側も同じ扱い）。
  "profile.layanan_title": "当社のプログラムとサービス",
  "profile.why_title": "なぜ日本なのか？",
  "profile.why_desc": "候補者から最も多く挙がる三つの理由。",
  "profile.why_wage_title": "給与",
  "profile.why_wage_body": "最低賃金は月15〜25万円。インドネシアとの生活費の差を考えれば見合います。",
  "profile.why_exp_title": "新しい経験と挑戦",
  "profile.why_exp_body": "インドネシアとは異なる生活様式、文化、規律。",
  "profile.why_season_title": "四季のある暮らし",
  "profile.why_season_body": "春・夏・秋・冬。インドネシアには二季しかありません。",
  "profile.why_tip": "日本での仕事は負荷が大きくなります。最も得意な能力に合った仕事を選び、日本語はできるだけ深く学んでください。",
  "profile.prog_title": "ASJのプログラム",
  "profile.prog_desc": "日本への二つの公式ルートと、そのための語学研修。",
  "profile.prog_magang_title": "技能実習",
  "profile.prog_magang_body": "申込みから出国まで一貫してサポートします。",
  "profile.prog_tg_title": "特定技能",
  "profile.prog_tg_body": "介護、食品加工、外食、農業、畜産。",
  "profile.prog_bahasa_title": "日本語",
  "profile.prog_bahasa_body": "語学、技能、日本文化の研修。",
  "profile.prog_price_label": "プログラム費用",
  "profile.prog_payment": "分割払いが可能で、渡航費用の立て替え制度もあります。",
  "profile.prog_includes_title": "含まれるもの",
  "profile.prog_inc_module": "教材と辞書",
  "profile.prog_inc_uniform": "機関の制服",
  "profile.prog_inc_dorm": "寮",
  "profile.prog_inc_exam": "JFT・SSWの受験それぞれ1回",
  "profile.step_title": "受入れの流れ",
  "profile.step_desc": "申込みから出国までの6ステップ。",
  "profile.step_reg_title": "登録",
  "profile.step_reg_body": "健康診断、書類確認、申込みフォームの記入。",
  "profile.step_train_title": "研修・教育",
  "profile.step_train_body": "日本語、技能、日本文化の研修。",
  "profile.step_interview_title": "面接",
  "profile.step_interview_body": "日本企業との面接。",
  "profile.step_doc_title": "雇用書類",
  "profile.step_doc_body": "インドネシア国内での書類手続き。",
  "profile.step_prep_title": "書類準備",
  "profile.step_prep_body": "健康診断（MCU）と雇用契約の署名、その後、日本入管への書類手続き（COE）。",
  "profile.step_go_title": "日本へ出発",
  "profile.step_go_body": "パスポート、ビザ、EKTLNの手続き。",
  "profile.req_title": "応募条件と必要書類",
  "profile.req_desc": "お申込み前にご確認ください。",
  "profile.req_age": "男女とも18〜28歳",
  "profile.req_edu": "最終学歴が高校・専門学校卒以上",
  "profile.req_marital": "未婚・既婚いずれも可",
  "profile.req_body": "男性は身長160cm以上、体重50kg以上",
  "profile.req_health": "心身ともに健康な方",
  "profile.req_tattoo": "タトゥー・ピアスがないこと",
  "profile.req_vision": "色覚異常がなく、結核でないこと",
  "profile.req_docs_title": "ご用意いただく書類",
  "profile.doc_form": "指定の申込書に記入",
  "profile.doc_consent": "保護者の同意書",
  "profile.doc_ktp": "KTP（身分証）のスキャン／コピー",
  "profile.doc_birth": "出生証明書のスキャン／コピー",
  "profile.doc_kk": "戸籍（カルテ・クルアルガ）のスキャン／コピー",
  "profile.doc_diploma": "卒業証明書のスキャン／コピー（小学校〜高校）",
  "profile.doc_photo": "証明写真 3×4 を2枚",
  "profile.vision_title": "ビジョンとミッション",
  "profile.vision_heading": "ビジョン",
  "profile.vision_body": "PT AMANAH SAKURA JAPANを、グローバル時代に対応できる人材を育成し、科学技術の発展に応じて課題に応えられる、専門的で質の高い教育機関とすること。外国語教育の開発を通じて実現します。",
  "profile.mission_heading": "ミッション",
  "profile.mission_1": "日本語の教育・研修プログラムを専門的に実施する",
  "profile.mission_2": "熟練した専門的な人材を育成する",
  "profile.mission_3": "国内外の産業界・企業との連携を構築する",
  "profile.mission_4": "海外就労の機会を開き、雇用を創出する",
  "profile.legal_title": "法的認可",
  "profile.legal_desc": "確認できる法人格と登録番号。",
  "profile.legal_form": "法人格",
  "profile.legal_sk": "法務省認可",
  "profile.legal_deed": "公証人証書",
  "profile.legal_regno": "登録番号",
  "profile.legal_register": "法人登録",
  "profile.legal_seat": "所在地",

  // 識別子ではない値だけを訳す（法人形態の説明・日付を含む公証人証書・所在地）。
  // "Ponorogo" は既存の profile.fac_office_body が既に「ポノロゴ」と訳しているので、
  // ここも同じ表記に合わせる（同じ語が2通りに訳されるのを避ける）。
  "profile.legal_form_value": "株式会社（PT）・国内民間企業",
  "profile.legal_deed_value": "第09号、2023年8月15日 — 公証人 スティア・ブディ",
  "profile.legal_seat_value": "東ジャワ州ポノロゴ県",
  "profile.contact_located_value": "東ジャワ州ポノロゴ県",

  // 住所（街路レベル）。正式な住所は id 辞書側のインドネシア語表記で、こちらは
  // 読みの補助。日本語話者がラテン文字の転写を読めない場合に備えてカタカナ・
  // 漢字で示す。封筒や配送伝票にはインドネシア語の表記を使うこと。
  "profile.contact_address_value": "東ジャワ州ポノロゴ県スコレジョ郡ガンドゥ・ケプフ村ヌグンジュン集落 03RW/03RT、カイ・アグン・ムサカフ通り",

  // 営業時間 — オーナー回答 2026-09-30（COMPANY_PROFILE_DATA.md P-4）。
  // 「スロー・レスポンス」というオーナー自身の表現をそのまま残している。より丁寧な
  // 言い換えにすると、どの程度遅いのかという小さな編集上の主張をこちらが加えることになる。
  "profile.contact_hours": "営業時間",
  "profile.contact_hours_value": "月曜 – 土曜、08:00 – 16:00（WIB／インドネシア西部時間）",
  "profile.contact_hours_note": "祝日・休業日、および営業時間外は、ご返信が遅くなります。",
  "profile.fac_title": "施設とサポート",
  "profile.fac_desc": "研修中に利用できる環境。",
  "profile.fac_class_title": "日本語教室",
  "profile.fac_class_body": "JLPT N1取得の講師による対面授業。",
  "profile.fac_office_title": "事務所",
  "profile.fac_office_body": "東ジャワ州ポノロゴの運営事務所。",
  "profile.fac_guest_title": "応接室",
  "profile.fac_guest_body": "保護者・応募者との面談スペース。",
  "profile.fac_dorm_title": "寮",
  "profile.fac_dorm_body": "ベッド、WiFi、キッチン、洗濯場、業務用車両。",
  "profile.fac_uniform_title": "制服と教材",
  "profile.fac_uniform_body": "機関の制服、教材、辞書。",
  "profile.fac_exam_title": "JFT・SSW試験",
  "profile.fac_exam_body": "各1回の受験料がプログラム費用に含まれます。",
  "profile.place_food": "食品加工",
  "profile.place_farm": "農業",
  "profile.place_livestock": "畜産",

  // 配置先の県名。ローマ字表記のままだと日本語話者には読めないため、
  // 漢字表記に切り替える（中間のドットは両言語で同じ字形）。
  "profile.place_food_area": "宮崎・岡山",
  "profile.place_farm_area": "宮崎・長野",
  "profile.place_livestock_area": "鹿児島",

  // 金額は「識別子」ではなく「数量」なので訳す。日本語の万進法に合わせ、
  // 通貨もカタカナで示す（単語ごとの置換ではない）。
  "profile.prog_price": "600万ルピア",

  // ── 配属先（R4、13・14ページ） ────────────────────────────────────────
  // モックアップはこの枠を「体験談」で埋めていたが、会社案内に体験談は
  // 一切ない。代わりに確認可能な事実——日付入りの面接バナーから読み取った
  // 4つの県——を掲載する。
  "profile.place_title": "配属先",
  "profile.place_desc": "会社資料に記載された職種と配属先の都道府県です。",
  "profile.place_note": "都道府県名は公式資料に合わせてラテン文字で表記しています。",
  "profile.mitra_title": "提携パートナー",
  "profile.mitra_desc": "日本への渡航は、以下の提携LPKおよびPT（SO）と共同で行っています。",
  "profile.mitra_note": "当社はSOの認定を受けていないため、受講者の日本への渡航は、当社とMoUを締結した提携LPKおよびPT（SO）が実施します。",
  "profile.mitra_kind_gloss": "注記：社名下のバッジは「渡航許可のステータス」です（SO＝送出し機関として渡航を実施する権限）。法人形態（PT／LPK）を示すものではありません。社名は各社が自称する名称をそのまま使っているため、「LPK」と名乗りつつSO許可を持つ提携先もあります。",
  "profile.mitra_cta_desc": "当社との提携（MoU）をご希望の方は、下の「お問い合わせ」よりご連絡ください。",
  "profile.mitra_slot_pending": "スロット未設定",

  // 提携先の6社名（オーナーが2026-09-29に提供）。
  // 社名は固有名詞なので翻訳しない——日本語ページでも登記上の名称をそのまま
  // 表示する。「PT Flora Talent Indonesia」を別名に置き換えると、提携先が
  // 自ら公開している名称と食い違い、第三者の社名を書き換えたことになる。
  "profile.mitra_1_name": "PT Flora Talent Indonesia",
  "profile.mitra_2_name": "PT Human Mandiri Indonesia",
  "profile.mitra_3_name": "LPK Japanesia",
  "profile.mitra_4_name": "PT JIPA",
  "profile.mitra_5_name": "LPK Jinzai Servis Indonesia",
  "profile.mitra_6_name": "PT Hibiki Cendekia Mandala",

  // ── 卒業生の声（口コミモデル、2026-09-29追加）──────────────────────────
  // 引用文そのものはまだ入っていない——オーナー提供の実際の口コミとともに入る
  // （src/lib/testimonials.ts 参照）。ここにあるのはセクション自身のラベル。
  "profile.review_title": "卒業生の声",
  "profile.review_desc": "当校で学び、ともに日本へ渡航した受講者の声です。",
  "profile.review_count_from": "Googleマップの",
  "profile.review_count_of": "件の口コミより",
  "profile.review_open_maps": "Googleマップで見る",
  "profile.review_cta_desc": "当校で学んだ経験や渡航経験のある方は、下のお問い合わせよりお聞かせください。",
  "profile.review_slot_pending": "口コミ未掲載",
  "profile.review_pending_author": "口コミ待ち",

  // ── FAQ（#faq） — 2026-09-29 追加 ─────────────────────────────────────
  // 回答はすべて docs/COMPANY_PROFILE_DATA.md（会社の公式印刷プロフィール）から
  // 転記。出典は src/lib/faq.ts に項目ごとに記載。
  // ⚠ 出典のない質問を追加しないこと。特に最低身長は印刷ページ間で矛盾したまま
  //（§12 K-3）で選考基準のため、記載しない。
  "profile.faq_title": "よくあるご質問",
  "profile.faq_desc": "受講希望者からよく寄せられる質問に、機関の公式資料に基づいてお答えします。",
  "profile.faq_q_cost": "プログラムの費用はいくらですか？",
  "profile.faq_a_cost": "プログラム費用は600万ルピアです。",
  "profile.faq_q_includes": "600万ルピアには何が含まれますか？",
  "profile.faq_a_includes": "学習モジュールと辞書、機関の制服、寮、そしてJFTおよびSSWの試験（各1回）の4つが含まれます。",
  "profile.faq_q_installment": "費用は分割払いできますか？",
  "profile.faq_a_installment": "可能です。分割でのお支払いができます。",
  "profile.faq_q_bridge": "渡航費用がまだ用意できない場合は？",
  "profile.faq_a_bridge": "渡航費用を支援するための立替制度（ダナ・タラン）があります。",
  "profile.faq_q_requirements": "参加するための条件は何ですか？",
  "profile.faq_a_requirements": "18〜28歳、学歴は高校／専門学校卒業以上、心身ともに健康で、タトゥーおよびピアスがないこと。最低身長やその他の条件はプログラム経路により異なりますので、お問い合わせください。",
  "profile.faq_q_process": "手続きにはどのくらいかかり、どのような段階がありますか？",
  "profile.faq_a_process": "6段階です。登録と書類審査、日本語・日本文化の研修、日本企業との採用面接、インドネシアでの書類手続き、健康診断（MCU）と契約署名およびCOE申請、そして日本への渡航です。",

  // ── 求人概要（R2、右レール） — 2026-09-24 削除 ────────────────────────
  // `profile.mini_*` の4キーは `#loker-ringkas` セクションと `JobMiniList` の
  // 削除に伴い削除した。オーナー判断: `/` は MoU・取引先向けの会社プロフィール
  // であり、求人ボードではない。セクションを復活させない限りキーも復活させない。
  // ── 会社概要（S7、2ページ） ──────────────────────────────────────────
  // 挨拶文は原文のまま（表記も含めて）。公式の声明を勝手に整えてはならない。
  "profile.about_title": "会社概要",
  "profile.about_desc": "ポノロゴの日本語・就労文化訓練機関です。",
  "profile.about_p1": "PT Amanah Sakura Japanは、東ジャワ州ポノロゴ県に拠点を置くLPK（職業訓練機関）です。日本語、就労スキル、日本文化の研修を通じて、インターンシップおよび特定技能のルートを目指すインドネシア人労働希望者の準備を行っています。",
  "profile.about_p2": "当社は小規模なLPKであり、SO（送出機関）の認定をまだ受けていないため、単独で日本へ直接送り出す権限はありません。日本への渡航・配属は、業務提携契約（MoU）を締結した提携LPKおよびPT（SO）のネットワークと共同で実施しています。当社の役割は、登録から語学研修、JFT・SSW試験、書類準備まで受講者を送り出せる状態に整え、送出を行う提携SOへ引き継ぐことです。各段階に専任の講師がおり、組織体制はチームのセクションでご確認いただけます。",
  "profile.about_welcome": "私たちは、自らを支え、労働市場に立ち向かうことができる人材の能力を高め、技能を向上させることに努めています。",
  "profile.about_caption": "LPK Amanah Sakura Japan 事務所にて、受講生とスタッフ — 東ジャワ州ポノロゴ",
  "profile.about_cta": "プログラムについて",
  "profile.about_so_note": "当社はまだSO（送出機関）の認定を受けていません。日本への渡航は、MoUを締結した提携LPKおよびPT（SO）と共同で行っています。",
  "profile.about_so_note_label": "SO（送出機関）の認定状況",

  // ── 沿革（S9、`#tentang`） ────────────────────────────────────────────
  "profile.history_1_title": "2023年8月15日 — 設立",
  "profile.history_1_body": "PT Amanah Sakura Japanは、2023年8月15日付の公証人証書第09号（公証人 Setya Budhi, S.H.）に基づき、ポノロゴ県に設立されました。",
  "profile.history_2_title": "2023年8月28日 — 法人認可",
  "profile.history_2_body": "インドネシア共和国法務人権省が、決定番号 AHU-0063921.AH.01.01.TAHUN 2023、登録番号 4023082735107914 をもって法人の設立を認可しました。",
  "profile.history_3_title": "2023年 — 能力基準訓練",
  "profile.history_3_body": "「日本語訓練」を題目とする能力基準訓練プログラムを実施し、JLPT N1 取得の講師を配置して、受講生が日本で就労できるまで指導しています。",

  // ── ギャラリー（R3） ──────────────────────────────────────────────────
  // キャプションのみ。各写真の代替テキストは src/lib/gallery.ts にあります。
  "profile.gallery_title": "活動ギャラリー",
  "profile.gallery_desc": "訓練の様子、事務所、参加者の出発。",
  "profile.gal_gedung": "ポノロゴの事務所と参加者",
  "profile.gal_staf": "講師と運営スタッフ",
  "profile.gal_kelas": "面接対策の準備",
  "profile.gal_tamu": "参加者の書類提出",
  "profile.gal_siswa": "訓練参加者の同期",
  "profile.gal_berangkat": "出発の見送り",
  "profile.gal_n1": "JLPT N1取得の講師",
  "profile.gal_layanan": "書類を持つ参加者",

  // ── チームと資格（S10、8ページおよび10ページ） ──────────────────────
  "profile.team_title": "チームと資格",
  "profile.team_desc": "組織体制と講師の資格。",
  "profile.team_komisaris": "監査役",
  "profile.team_direktur": "取締役",
  "profile.team_edu_manager": "教育訓練マネージャー",
  "profile.team_admin": "管理事務スタッフ",
  "profile.team_instructor": "日本語講師",
  "profile.team_instructor_2": "日本語講師",
  "profile.team_n1_note": "JLPT N1取得、証明書 N1A225127J",
  "profile.cred_title": "講師の資格",
  "profile.cred_jlpt_label": "講師の資格",
  "profile.team_name_pending": "未公開",

  // ── 氏名（人名）─────────────────────────────────────────────────────
  // WHY THESE ARE KEYS EVEN THOUGH THEY ARE PROPER NOUNS, and why they are the
  // ONLY kind of proper noun in this file that is keyed.
  // The rule this codebase writes down is: "an identifier is invariant; a NAME
  // or a QUANTITY is not." A company registration number, an email address or
  // an AHU decree number must read identically in both languages, because they
  // are lookup keys — rewriting them breaks the reference. A PERSON'S NAME is
  // the opposite: it is the text a Japanese reader has to recognise on a
  // business card and a staffing chart, and the company publishes the kana form
  // itself. Leaving the Latin spelling unkeyed meant the JP page showed six
  // Indonesian spellings inside an otherwise fully Japanese section, which is
  // exactly the "untranslated string" class e2e/probe-untranslated.mjs hunts.
  "profile.team_name_direktur": "コイルル・ムスタキム",
  "profile.team_name_komisaris": "トリヤ・スマルヤティ",
  "profile.team_name_edu_manager": "ハディ・プラソジョ",
  "profile.team_name_admin": "アヨク・ワヒュ・サプトロ",
  "profile.team_name_instructor": "リアン・ハリ・ウィジャヤ",
  "profile.team_name_instructor_2": "ウィウィット・T・シャフィトリ",

  // ── 連絡先と所在地（R1/R5、5・8・9ページ） ──────────────────────────
  "profile.contact_title": "お問い合わせ",
  "profile.contact_desc": "お電話・メール・フォームよりお気軽にお問い合わせください。",
  "profile.contact_address": "住所",
  "profile.contact_phone": "電話",
  "profile.contact_email": "メール",
  "profile.contact_located": "所在地",
  "profile.loc_title": "所在地",
  "profile.loc_desc": "東ジャワ州ポノロゴ県に事務所があります。",
  "profile.loc_open_maps": "Googleマップで開く",

  // ── お問い合わせのQRコード（#kontak） ───────────────────────────────
  // ラベルはブランド名なので両言語で同一。リンクのアクセシブル名（_aria）は
  // 日本語化する。QR画像の alt は各コード固有の説明なので共有キーにしない。
  "profile.qr_whatsapp": "WhatsApp",
  "profile.qr_instagram": "Instagram",
  "profile.qr_tiktok": "TikTok",
  "profile.qr_whatsapp_aria": "PT Amanah Sakura JapanのWhatsAppを開く",
  "profile.qr_instagram_aria": "PT Amanah Sakura JapanのInstagramを開く",
  "profile.qr_tiktok_aria": "PT Amanah Sakura JapanのTikTokを開く",

  // ── お問い合わせフォーム（公開・認証不要） ──────────────────────────
  "contact.title": "メッセージを送る",
  "contact.desc": "下記のフォームよりお問い合わせください。",
  "contact.field_nama": "お名前",
  "contact.field_wa": "WhatsApp番号",
  "contact.field_subjek": "件名",
  "contact.field_pesan": "メッセージ",
  "contact.send": "送信する",
  "contact.sending": "送信中...",
  "contact.sent_title": "メッセージを受け付けました。",

  // One line for the same reason as the `id` dictionary: the coverage gate
  // matches `"key": "value"` textually, so a wrapped value reads as missing.
  "contact.sent_body": "担当者より営業日にWhatsAppにてご連絡いたします。お急ぎの場合は、右記の番号までお電話ください。",
  "contact.failed": "送信できませんでした。もう一度お試しいただくか、WhatsAppにてご連絡ください。",

  // クライアント側バリデーション — Netlify Forms への移行に伴い 2026-09-30 追加。
  // 元はサーバー側が持っていたメッセージだが、そのサーバーはこのリポジトリに無い。
  // `id` 辞書と同じ理由で 1 行：カバレッジ検査は `"key": "value"` をテキストで照合する。
  "contact.err_required": "お名前・WhatsApp番号・件名・メッセージをすべてご入力ください。",
  "contact.err_wa": "WhatsApp番号の形式が正しくありません。例：0812-3456-7890",
  "contact.privacy": "お返事は営業日にWhatsAppにてお送りします。",

  // ── セクションナビゲーション（ドロワー） ────────────────────────────
  // 2026-09-30 追加。このリポジトリに存在しないルートへのリンク 4 本
  // （/loker、/candidate、/admin、/public）を置き換えたもの。
  "nav.layanan": "サービス",
  "nav.program": "プログラム",
  "nav.alur": "お申し込みの流れ",
  "nav.galeri": "ギャラリー",
  "nav.legal": "法的情報",
  "nav.tim": "チーム",
  "nav.mitra": "パートナー",
  "nav.faq": "よくある質問",
  "nav.kontak": "お問い合わせ",

  // `#layanan` は e9317cf で解決するようになった（タブパネルが通常の
  // セクションになった）。id 辞書と同じキーを必ず持つこと。
  "public.layanan_magang": "研修プログラム",
  "public.layanan_magang_desc": "日本企業で研修",
  "public.layanan_tg_desc": "特定技能SSW",
  "public.layanan_tg_ssw": "SSWプログラム",

    // ── ステップガイド（StepGuide.tsx）──
    // 「次にやることは何か」を1枚で示す。点数や順位の言葉は入れない
    // （docs/ILLUSTRATION_SPEC.md §6.2）。
    "footer.copyright": "© 2026 PT AMANAH SAKURA JAPAN. ALL RIGHTS RESERVED.",

    // フッターのクイックリンク。id 辞書と同じキーを必ず持つこと。
    "footer.nav_heading": "ナビゲーション",
    "footer.nav_program": "プログラム",
    "footer.nav_alur": "応募の流れ",
    "footer.nav_fasilitas": "施設",
    "footer.nav_tentang": "会社概要",
    "footer.social_heading": "SNS",
    "footer.contact_heading": "お問い合わせ",
    "footer.blurb": "ポノロゴの日本語・就労文化訓練を行うLPKです。配属はMoUを締結した提携LPK・PT（SO）と共同で行います。",
    "footer.tagline": "夢を日本へ",
    "footer.title": "PT Amanah Sakura Japan",

    // ─── Password / CV mini / misc helpers ───────────────────────────────────
    "ui.crash_title": "エラーが発生しました（クラッシュ）",

    // ─── 404 (src/pages/404.astro) ───────────────────────────────────────────
    "notfound.title": "ページが見つかりません",
    "notfound.body": "お開きになったアドレスは存在しないか、移動されました。リンクをご確認いただくか、ホームページからお進みください。",
    "notfound.home": "ホームへ",
    "notfound.contact": "お問い合わせ",

    // ─── 文書タイトル / <title> ─────────────────────────────────────────────
    // Server-rendered <title> stays Indonesian on purpose (crawlers and link
    // previews cannot run JS); BaseLayout assigns document.title from these
    // keys after hydration and on every toggle. The company's legal name stays
    // as-is in both languages, which is why every entry keeps it verbatim.
    "doc.title_home": "PT Amanah Sakura Japan — 会社概要",
    "doc.title_notfound": "ページが見つかりません — PT Amanah Sakura Japan",
};
