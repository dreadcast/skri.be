# Data

The data is your blog content.

Your blog content will be in a `data` folder. Each subfolder is a potential blog entry (article) containing a `data.md` file and any amount of attached files (images, videos, PDF, etc). Nested posts should work, but are not tested yet.

## Front matter
[Front matter](https://jekyllrb.com/docs/frontmatter/) allows your to add metadata to your blog posts using YAML format.

Standards fields are:

- created: Entry creation date (ISO 8601).
- tags: Coma separated tags.
- medias: List of medias, more info below.

### Medias
Either list your medias URL or add some more info.

#### URLs list
```
medias:
    - https://www.youtube.com/watch?v=MGuKhcnrqGA
    - https://soundcloud.com/figubbrazlevic/sets/tek-figub-the-everyday-headnod
    - image.jpg
```

#### Media collection
This way allows you to describe your medias.

`id` key is optional. If omitted, url key is used as id.

```
medias:
    - caption: React Conf
      url: https://www.youtube.com/watch?v=MGuKhcnrqGA
      id: react-video
    - caption: Tek & Figub - The Everyday Headnod
      url: https://soundcloud.com/figubbrazlevic/sets/tek-figub-the-everyday-headnod
      id: figub
    - caption: My great image
      url: image.jpg
    - caption: My other great image
      url: other-image.jpg
```
