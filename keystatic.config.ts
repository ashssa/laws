import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    act: collection({
      label: '法規 (Act)',
      slugField: 'id',
      path: 'src/content/act/**',
      format: { contentField: 'content' },
      schema: {
        id: fields.text({
          label: '檔案名稱 / 路徑',
          description: '例如: act01。若要放在資料夾內可用斜線 (例如: _folder/act01)',
          validation: { length: { min: 1 } },
        }),
        title: fields.text({ label: '標題 (Title)', validation: { length: { min: 1 } } }),
        abbr: fields.text({ label: '簡稱 (Abbr)', description: '選填' }),
        url: fields.url({ label: '沿革連結 (URL)', description: '選填，例如 /amendments/act01' }),
        content: fields.markdoc({ label: '法規內文', extension: 'md', description: '包含 heading 2 修法歷程、法規內容（直接 Word 貼上）、本法附件' }),
      },
    }),

    amendments: collection({
      label: '修法歷程 (Amendments)',
      slugField: 'id',
      path: 'src/content/amendments/**',
      format: { contentField: 'content' },
      schema: {
        id: fields.text({
          label: '檔案名稱 / 路徑',
          description: '例如: _act01/act01-v01',
          validation: { length: { min: 1 } },
        }),
        title: fields.text({ label: '標題 (Title)', validation: { length: { min: 1 } } }),
        target_act: fields.relationship({
          label: '目標法規 (Target Act)',
          collection: 'act',
          validation: { isRequired: true },
        }),
        date: fields.date({ label: '日期 (Date)', validation: { isRequired: true } }),
        version: fields.text({ label: '版本 (Version)', description: '例如: v01', validation: { length: { min: 1 } } }),
        term: fields.integer({ label: '屆次 (Term)', description: '選填' }),
        description: fields.text({ label: '描述 (Description)', description: '選填', multiline: true }),
        content: fields.markdoc({ label: '內文', extension: 'md', description: '以 heading 3 標示條號或章節等，並在 heading 3 下文中依序放入【修正條文】、【現行條文】、【說明】' }),
      },
    }),

    blog: collection({
      label: '部落格 (Blog)',
      slugField: 'id',
      path: 'src/content/blog/**',
      format: { contentField: 'content' },
      schema: {
        id: fields.text({
          label: '檔案名稱 / 路徑',
          description: '例如: _05日常更新/my-post',
          validation: { length: { min: 1 } },
        }),
        title: fields.text({ label: '標題 (Title)', validation: { length: { min: 1 } } }),
        author: fields.text({ label: '作者 (Author)', validation: { length: { min: 1 } }, description: '不會對外公開顯示' }),
        pubDate: fields.date({ label: '發布日期 (Pub Date)', validation: { isRequired: true } }),
        modDate: fields.date({ label: '修改日期 (Mod Date)' }),
        slug: fields.text({ label: '自訂網址路由 (Slug)', validation: { length: { min: 1 } } }),
        showInHomePage: fields.checkbox({ label: '顯示於首頁 (Show in Home Page)', defaultValue: false }),
        pinned: fields.checkbox({ label: '置頂 (Pinned)', defaultValue: false }),
        draft: fields.checkbox({ label: '草稿 (Draft)', defaultValue: false }),
        tags: fields.array(
          fields.text({ label: '標籤' }),
          { label: '標籤 (Tags)', itemLabel: props => props.value }
        ),
        description: fields.text({ label: '摘要描述 (Description)', multiline: true, validation: { length: { min: 1 } } }),
        content: fields.markdoc({ label: '內文', extension: 'md', description: '標題部分，從 heading 2 開始使用' }),
      },
    }),
  },
});
