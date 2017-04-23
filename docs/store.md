
## Category
`redis.HSET category:hash <alias> name <value>`

e.g.:

```
redis.HSET 'category:hash' 'giai-tri' 'name' 'Giải trí'
```


## Articles

`redis.HMSET article:hash:<alias> title <title_value> thumb <thumb> excerpt <excerpt> content <excerpt>`

e.g.:

```
redis.HMSET 'article:hash:tranh-co-dong-thap-nien-90-ruc-ro-phu-kin-ngo-pho-o-ha-noi' 'title' 'Tranh cổ động thập niên 90 rực rỡ phủ kín ngõ phố ở Hà Nội' 'thumb' 'https://dantricdn.com/zoom/130_100/2017/kyo-4195-1492703138037.jpg' 'excerpt' '(Dân trí) - Những bức tranh đủ loại kích thước lớn nhỏ và sắc màu phủ kín con ngõ Ao Dài (Bắc Từ Liêm, Hà Nội) khiến nhiều người phải kinh ngạc.' 'content' '...'
```


#### Index
##### Index article. it support get article and paging feature
`redis.lpush ref_cate_article:all <articleKey>`

e.g.:

```
redis.LPUSH 'ref_cate_article:all' 'article:hash:tranh-co-dong-thap-nien-90-ruc-ro-phu-kin-ngo-pho-o-ha-noi'
```

##### Index article by category. it support get article by category with paging feature
`redis.lpush ref_cate_article:<categoryAlias> <articleKey>`

e.g.:

```
redis.LPUSH 'ref_cate_article:nhip-song-tre' 'article:hash:tranh-co-dong-thap-nien-90-ruc-ro-phu-kin-ngo-pho-o-ha-noi'
```
