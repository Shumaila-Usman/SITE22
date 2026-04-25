

  // Products — Sports Wear
  const swProds = [
    // Basketball Uniforms MCI-01 to MCI-04
    { code:'MCI-01', sub:'basketball-uniforms', desc:'100% Polyester, 160-200gsm, breathable, quick dry', sizes:'S,M,L,XL,2XL', colors:'All colors', tags:['basketball','uniform'] },
    { code:'MCI-02', sub:'basketball-uniforms', desc:'100% Polyester, 160-200gsm, breathable, quick dry', sizes:'S,M,L,XL,2XL', colors:'All colors', tags:['basketball','uniform'] },
    { code:'MCI-03', sub:'basketball-uniforms', desc:'100% Polyester, 160-200gsm, breathable, quick dry', sizes:'S,M,L,XL,2XL', colors:'All colors', tags:['basketball','uniform'] },
    { code:'MCI-04', sub:'basketball-uniforms', desc:'100% Polyester, 160-200gsm, breathable, quick dry', sizes:'S,M,L,XL,2XL', colors:'All colors', tags:['basketball','uniform'] },
    // Shooter Shirts MCI-05 to MCI-08
    { code:'MCI-05', sub:'shooter-shirts', desc:'Pro-style carbon heather, wicking mesh, 100% polyester', sizes:'S-2XL', colors:'All colors', tags:['basketball','shooter'] },
    { code:'MCI-06', sub:'shooter-shirts', desc:'Pro-style carbon heather, wicking mesh, 100% polyester', sizes:'S-2XL', colors:'All colors', tags:['basketball','shooter'] },
    { code:'MCI-07', sub:'shooter-shirts', desc:'Pro-style carbon heather, wicking mesh, 100% polyester', sizes:'S-2XL', colors:'All colors', tags:['basketball','shooter'] },
    { code:'MCI-08', sub:'shooter-shirts', desc:'Pro-style carbon heather, wicking mesh, 100% polyester', sizes:'S-2XL', colors:'All colors', tags:['basketball','shooter'] },
    // Soccer Track Suits MCI-09 to MCI-012
    { code:'MCI-09',  sub:'soccer-track-suits', desc:'Polyester mesh lining, full zip, pockets', sizes:'S-2XL', colors:'All colors', tags:['soccer','tracksuit'] },
    { code:'MCI-010', sub:'soccer-track-suits', desc:'Polyester mesh lining, full zip, pockets', sizes:'S-2XL', colors:'All colors', tags:['soccer','tracksuit'] },
    { code:'MCI-011', sub:'soccer-track-suits', desc:'Polyester mesh lining, full zip, pockets', sizes:'S-2XL', colors:'All colors', tags:['soccer','tracksuit'] },
    { code:'MCI-012', sub:'soccer-track-suits', desc:'Polyester mesh lining, full zip, pockets', sizes:'S-2XL', colors:'All colors', tags:['soccer','tracksuit'] },
    // Baseball Uniforms MCI-013 to MCI-016
    { code:'MCI-013', sub:'baseball-uniforms', desc:'Pro-weight polyester, double stitching', sizes:'S-2XL', colors:'All colors', tags:['baseball','uniform'] },
    { code:'MCI-014', sub:'baseball-uniforms', desc:'Pro-weight polyester, double stitching', sizes:'S-2XL', colors:'All colors', tags:['baseball','uniform'] },
    { code:'MCI-015', sub:'baseball-uniforms', desc:'Pro-weight polyester, double stitching', sizes:'S-2XL', colors:'All colors', tags:['baseball','uniform'] },
    { code:'MCI-016', sub:'baseball-uniforms', desc:'Pro-weight polyester, double stitching', sizes:'S-2XL', colors:'All colors', tags:['baseball','uniform'] },
    // Volleyball Uniforms MCI-017 to MCI-021
    { code:'MCI-017', sub:'volleyball-uniforms', desc:'Pro-weight polyester, double stitching', sizes:'S-2XL', colors:'All colors', tags:['volleyball','uniform'] },
    { code:'MCI-018', sub:'volleyball-uniforms', desc:'Pro-weight polyester, double stitching', sizes:'S-2XL', colors:'All colors', tags:['volleyball','uniform'] },
    { code:'MCI-019', sub:'volleyball-uniforms', desc:'Pro-weight polyester, double stitching', sizes:'S-2XL', colors:'All colors', tags:['volleyball','uniform'] },
    { code:'MCI-020', sub:'volleyball-uniforms', desc:'Pro-weight polyester, double stitching', sizes:'S-2XL', colors:'All colors', tags:['volleyball','uniform'] },
    { code:'MCI-021', sub:'volleyball-uniforms', desc:'Pro-weight polyester, double stitching', sizes:'S-2XL', colors:'All colors', tags:['volleyball','uniform'] },
    // Soccer Uniforms MCI-022 to MCI-026
    { code:'MCI-022', sub:'soccer-uniforms', desc:'100% polyester fabrics', sizes:'S-2XL', colors:'All colors', tags:['soccer','uniform'] },
    { code:'MCI-023', sub:'soccer-uniforms', desc:'100% polyester fabrics', sizes:'S-2XL', colors:'All colors', tags:['soccer','uniform'] },
    { code:'MCI-024', sub:'soccer-uniforms', desc:'100% polyester fabrics', sizes:'S-2XL', colors:'All colors', tags:['soccer','uniform'] },
    { code:'MCI-025', sub:'soccer-uniforms', desc:'100% polyester fabrics', sizes:'S-2XL', colors:'All colors', tags:['soccer','uniform'] },
    { code:'MCI-026', sub:'soccer-uniforms', desc:'100% polyester fabrics', sizes:'S-2XL', colors:'All colors', tags:['soccer','uniform'] },
    // American Football MCI-027 to MCI-030
    { code:'MCI-027', sub:'american-football-uniforms', desc:'Tackle twill, screen print, sublimation', sizes:'S-2XL', colors:'All colors', tags:['american football','uniform'] },
    { code:'MCI-028', sub:'american-football-uniforms', desc:'Tackle twill, screen print, sublimation', sizes:'S-2XL', colors:'All colors', tags:['american football','uniform'] },
    { code:'MCI-029', sub:'american-football-uniforms', desc:'Tackle twill, screen print, sublimation', sizes:'S-2XL', colors:'All colors', tags:['american football','uniform'] },
    { code:'MCI-030', sub:'american-football-uniforms', desc:'Tackle twill, screen print, sublimation', sizes:'S-2XL', colors:'All colors', tags:['american football','uniform'] },
    // Cricket MCI-031 to MCI-034
    { code:'MCI-031', sub:'cricket-uniforms', desc:'Moisture-wicking polyester jersey', sizes:'Chest-based', colors:'Not specified', tags:['cricket','uniform'] },
    { code:'MCI-032', sub:'cricket-uniforms', desc:'Moisture-wicking polyester jersey', sizes:'Chest-based', colors:'Not specified', tags:['cricket','uniform'] },
    { code:'MCI-033', sub:'cricket-uniforms', desc:'Moisture-wicking polyester jersey', sizes:'Chest-based', colors:'Not specified', tags:['cricket','uniform'] },
    { code:'MCI-034', sub:'cricket-uniforms', desc:'Moisture-wicking polyester jersey', sizes:'Chest-based', colors:'Not specified', tags:['cricket','uniform'] },
    // Ice Hockey MCI-035 to MCI-038
    { code:'MCI-035', sub:'ice-hockey-uniforms', desc:'3D hoodie pattern design', sizes:'Not specified', colors:'Not specified', tags:['ice hockey','uniform'] },
    { code:'MCI-036', sub:'ice-hockey-uniforms', desc:'3D hoodie pattern design', sizes:'Not specified', colors:'Not specified', tags:['ice hockey','uniform'] },
    { code:'MCI-037', sub:'ice-hockey-uniforms', desc:'3D hoodie pattern design', sizes:'Not specified', colors:'Not specified', tags:['ice hockey','uniform'] },
    { code:'MCI-038', sub:'ice-hockey-uniforms', desc:'3D hoodie pattern design', sizes:'Not specified', colors:'Not specified', tags:['ice hockey','uniform'] },
    // Tennis MCI-039 to MCI-042
    { code:'MCI-039', sub:'tennis-uniforms', desc:'Polyester, zipper closure, classic fit', sizes:'Not specified', colors:'Not specified', tags:['tennis','uniform'] },
    { code:'MCI-040', sub:'tennis-uniforms', desc:'Polyester, zipper closure, classic fit', sizes:'Not specified', colors:'Not specified', tags:['tennis','uniform'] },
    { code:'MCI-041', sub:'tennis-uniforms', desc:'Polyester, zipper closure, classic fit', sizes:'Not specified', colors:'Not specified', tags:['tennis','uniform'] },
    { code:'MCI-042', sub:'tennis-uniforms', desc:'Polyester, zipper closure, classic fit', sizes:'Not specified', colors:'Not specified', tags:['tennis','uniform'] },
    // Goalkeeper MCI-043 to MCI-046
    { code:'MCI-043', sub:'goalkeeper-uniforms', desc:'Lightweight moisture management fabric', sizes:'S-2XL', colors:'All colors', tags:['goalkeeper','soccer'] },
    { code:'MCI-044', sub:'goalkeeper-uniforms', desc:'Lightweight moisture management fabric', sizes:'S-2XL', colors:'All colors', tags:['goalkeeper','soccer'] },
    { code:'MCI-045', sub:'goalkeeper-uniforms', desc:'Lightweight moisture management fabric', sizes:'S-2XL', colors:'All colors', tags:['goalkeeper','soccer'] },
    { code:'MCI-046', sub:'goalkeeper-uniforms', desc:'Lightweight moisture management fabric', sizes:'S-2XL', colors:'All colors', tags:['goalkeeper','soccer'] },
    // Soccer Jerseys MCI-047 to MCI-050
    { code:'MCI-047', sub:'soccer-jerseys', desc:'Micro interlock fabric, moisture-wicking, breathable mesh', sizes:'S-2XL', colors:'All colors', tags:['soccer','jersey'] },
    { code:'MCI-048', sub:'soccer-jerseys', desc:'Micro interlock fabric, moisture-wicking, breathable mesh', sizes:'S-2XL', colors:'All colors', tags:['soccer','jersey'] },
    { code:'MCI-049', sub:'soccer-jerseys', desc:'Micro interlock fabric, moisture-wicking, breathable mesh', sizes:'S-2XL', colors:'All colors', tags:['soccer','jersey'] },
    { code:'MCI-050', sub:'soccer-jerseys', desc:'Micro interlock fabric, moisture-wicking, breathable mesh', sizes:'S-2XL', colors:'All colors', tags:['soccer','jersey'] },
    // Baseball Jerseys MCI-051 to MCI-054
    { code:'MCI-051', sub:'baseball-jerseys', desc:'Polyester stretch mesh, moisture management, button closure', sizes:'S-2XL', colors:'All colors', tags:['baseball','jersey'] },
    { code:'MCI-052', sub:'baseball-jerseys', desc:'Polyester stretch mesh, moisture management, button closure', sizes:'S-2XL', colors:'All colors', tags:['baseball','jersey'] },
    { code:'MCI-053', sub:'baseball-jerseys', desc:'Polyester stretch mesh, moisture management, button closure', sizes:'S-2XL', colors:'All colors', tags:['baseball','jersey'] },
    { code:'MCI-054', sub:'baseball-jerseys', desc:'Polyester stretch mesh, moisture management, button closure', sizes:'S-2XL', colors:'All colors', tags:['baseball','jersey'] },
    // Volleyball Jerseys MCI-055 to MCI-059
    { code:'MCI-055', sub:'volleyball-jerseys', desc:'V-neck / cross crew neck styles', sizes:'S-2XL', colors:'All colors', tags:['volleyball','jersey'] },
    { code:'MCI-056', sub:'volleyball-jerseys', desc:'V-neck / cross crew neck styles', sizes:'S-2XL', colors:'All colors', tags:['volleyball','jersey'] },
    { code:'MCI-057', sub:'volleyball-jerseys', desc:'V-neck / cross crew neck styles', sizes:'S-2XL', colors:'All colors', tags:['volleyball','jersey'] },
    { code:'MCI-058', sub:'volleyball-jerseys', desc:'V-neck / cross crew neck styles', sizes:'S-2XL', colors:'All colors', tags:['volleyball','jersey'] },
    { code:'MCI-059', sub:'volleyball-jerseys', desc:'V-neck / cross crew neck styles', sizes:'S-2XL', colors:'All colors', tags:['volleyball','jersey'] },
    // Cycling Wear MCI-060 to MCI-066
    { code:'MCI-060', sub:'cycling-wear', desc:'Polyester jersey, size per spec', sizes:'Not specified', colors:'Not specified', tags:['cycling'] },
    { code:'MCI-061', sub:'cycling-wear', desc:'Polyester jersey, size per spec', sizes:'Not specified', colors:'Not specified', tags:['cycling'] },
    { code:'MCI-062', sub:'cycling-wear', desc:'Polyester jersey, size per spec', sizes:'Not specified', colors:'Not specified', tags:['cycling'] },
    { code:'MCI-063', sub:'cycling-wear', desc:'80% Nylon, 20% Lycra', sizes:'Not specified', colors:'Not specified', tags:['cycling'] },
    { code:'MCI-064', sub:'cycling-wear', desc:'80% Nylon, 20% Lycra', sizes:'Not specified', colors:'Not specified', tags:['cycling'] },
    { code:'MCI-065', sub:'cycling-wear', desc:'80% Nylon, 20% Lycra', sizes:'Not specified', colors:'Not specified', tags:['cycling'] },
    { code:'MCI-066', sub:'cycling-wear', desc:'80% Nylon, 20% Lycra', sizes:'Not specified', colors:'Not specified', tags:['cycling'] },
    // Sports Bra MCI-067 to MCI-070
    { code:'MCI-067', sub:'sports-bra', desc:'Full support, hook & eye closure, adjustable straps', sizes:'Not specified', colors:'Not specified', tags:['sports bra','women'] },
    { code:'MCI-068', sub:'sports-bra', desc:'Full support, hook & eye closure, adjustable straps', sizes:'Not specified', colors:'Not specified', tags:['sports bra','women'] },
    { code:'MCI-069', sub:'sports-bra', desc:'Full support, hook & eye closure, adjustable straps', sizes:'Not specified', colors:'Not specified', tags:['sports bra','women'] },
    { code:'MCI-070', sub:'sports-bra', desc:'Full support, hook & eye closure, adjustable straps', sizes:'Not specified', colors:'Not specified', tags:['sports bra','women'] },
    // Sports Caps MCI-071 to MCI-074
    { code:'MCI-071', sub:'sports-caps', desc:'Cotton & acrylic, adjustable strap', sizes:'Not specified', colors:'Not specified', tags:['cap','accessories'] },
    { code:'MCI-072', sub:'sports-caps', desc:'Cotton & acrylic, adjustable strap', sizes:'Not specified', colors:'Not specified', tags:['cap','accessories'] },
    { code:'MCI-073', sub:'sports-caps', desc:'Cotton & acrylic, adjustable strap', sizes:'Not specified', colors:'Not specified', tags:['cap','accessories'] },
    { code:'MCI-074', sub:'sports-caps', desc:'Cotton & acrylic, adjustable strap', sizes:'Not specified', colors:'Not specified', tags:['cap','accessories'] },
    // Sports Bags MCI-075 to MCI-078
    { code:'MCI-075', sub:'sports-bags', desc:'Water-repellent finish, multiple pockets', sizes:'Not specified', colors:'Not specified', tags:['bag','accessories'] },
    { code:'MCI-076', sub:'sports-bags', desc:'Water-repellent finish, multiple pockets', sizes:'Not specified', colors:'Not specified', tags:['bag','accessories'] },
    { code:'MCI-077', sub:'sports-bags', desc:'Water-repellent finish, multiple pockets', sizes:'Not specified', colors:'Not specified', tags:['bag','accessories'] },
    { code:'MCI-078', sub:'sports-bags', desc:'Water-repellent finish, multiple pockets', sizes:'Not specified', colors:'Not specified', tags:['bag','accessories'] },
  ];

  for (const p of swProds) {
    const sid = await subId(p.sub);
    const slug = makeSlug(p.code, p.sub);
    await Prod.findOneAndUpdate({ code: p.code }, { code: p.code, name: p.sub + ' ' + p.code, slug, categoryId: sw._id, subcategoryId: sid, shortDescription: p.desc, sizes: p.sizes, colors: p.colors, moq: 50, price: null, currency: 'USD', image: '', gallery: [], tags: p.tags, isActive: true, isFeatured: false }, { upsert: true, new: true });
  }
  console.log('Sports Wear products done (78)');

  // Products — Casual Wear
  const cwProds = [
    { code:'MCI-079', sub:'track-suits', desc:'100% polyester micro ripstop', sizes:'S-3XL', colors:'All colors', tags:['tracksuit','casual'] },
    { code:'MCI-080', sub:'track-suits', desc:'100% polyester micro ripstop', sizes:'S-3XL', colors:'All colors', tags:['tracksuit','casual'] },
    { code:'MCI-081', sub:'track-suits', desc:'100% polyester micro ripstop', sizes:'S-3XL', colors:'All colors', tags:['tracksuit','casual'] },
    { code:'MCI-082', sub:'track-suits', desc:'100% polyester micro ripstop', sizes:'S-3XL', colors:'All colors', tags:['tracksuit','casual'] },
    { code:'MCI-083', sub:'track-suits', desc:'100% polyester micro ripstop', sizes:'S-3XL', colors:'All colors', tags:['tracksuit','casual'] },
    { code:'MCI-084', sub:'trousers', desc:'Cotton/elastane blend, 2-way stretch', sizes:'S-2XL', colors:'All colors', tags:['trousers','casual'] },
    { code:'MCI-085', sub:'trousers', desc:'Cotton/elastane blend, 2-way stretch', sizes:'S-2XL', colors:'All colors', tags:['trousers','casual'] },
    { code:'MCI-086', sub:'trousers', desc:'Cotton/elastane blend, 2-way stretch', sizes:'S-2XL', colors:'All colors', tags:['trousers','casual'] },
    { code:'MCI-087', sub:'trousers', desc:'Cotton/elastane blend, 2-way stretch', sizes:'S-2XL', colors:'All colors', tags:['trousers','casual'] },
    { code:'MCI-088', sub:'polo-shirts', desc:'Cotton/poly blend, comfortable wear', sizes:'S-2XL', colors:'All colors', tags:['polo','shirt'] },
    { code:'MCI-089', sub:'polo-shirts', desc:'Cotton/poly blend, comfortable wear', sizes:'S-2XL', colors:'All colors', tags:['polo','shirt'] },
    { code:'MCI-090', sub:'polo-shirts', desc:'Cotton/poly blend, comfortable wear', sizes:'S-2XL', colors:'All colors', tags:['polo','shirt'] },
    { code:'MCI-091', sub:'polo-shirts', desc:'Cotton/poly blend, comfortable wear', sizes:'S-2XL', colors:'All colors', tags:['polo','shirt'] },
    { code:'MCI-092', sub:'sweat-shirts', desc:'Double layered shoulder panels, durable fabric', sizes:'S-2XL', colors:'All colors', tags:['sweatshirt','casual'] },
    { code:'MCI-093', sub:'sweat-shirts', desc:'Double layered shoulder panels, durable fabric', sizes:'S-2XL', colors:'All colors', tags:['sweatshirt','casual'] },
    { code:'MCI-094', sub:'sweat-shirts', desc:'Double layered shoulder panels, durable fabric', sizes:'S-2XL', colors:'All colors', tags:['sweatshirt','casual'] },
    { code:'MCI-095', sub:'sweat-shirts', desc:'Double layered shoulder panels, durable fabric', sizes:'S-2XL', colors:'All colors', tags:['sweatshirt','casual'] },
    { code:'MCI-096', sub:'t-shirts', desc:'Cotton/polyester, double stitched', sizes:'S-2XL', colors:'All colors', tags:['tshirt','casual'] },
    { code:'MCI-097', sub:'t-shirts', desc:'Cotton/polyester, double stitched', sizes:'S-2XL', colors:'All colors', tags:['tshirt','casual'] },
    { code:'MCI-098', sub:'t-shirts', desc:'Cotton/polyester, double stitched', sizes:'S-2XL', colors:'All colors', tags:['tshirt','casual'] },
    { code:'MCI-099', sub:'t-shirts', desc:'Cotton/polyester, double stitched', sizes:'S-2XL', colors:'All colors', tags:['tshirt','casual'] },
    { code:'MCI-100', sub:'compression-shorts', desc:'Nylon/elastane, muscle support', sizes:'S-2XL', colors:'All colors', tags:['compression','shorts'] },
    { code:'MCI-101', sub:'compression-shorts', desc:'Nylon/elastane, muscle support', sizes:'S-2XL', colors:'All colors', tags:['compression','shorts'] },
    { code:'MCI-102', sub:'compression-shorts', desc:'Nylon/elastane, muscle support', sizes:'S-2XL', colors:'All colors', tags:['compression','shorts'] },
    { code:'MCI-103', sub:'compression-shirts', desc:'Polyester + spandex, moisture sensing', sizes:'S-2XL', colors:'All colors', tags:['compression','shirt'] },
    { code:'MCI-104', sub:'compression-shirts', desc:'Polyester + spandex, moisture sensing', sizes:'S-2XL', colors:'All colors', tags:['compression','shirt'] },
    { code:'MCI-105', sub:'compression-shirts', desc:'Polyester + spandex, moisture sensing', sizes:'S-2XL', colors:'All colors', tags:['compression','shirt'] },
    { code:'MCI-106', sub:'tees', desc:'Polyester/elastane, machine washable', sizes:'S-XL', colors:'All colors', tags:['tee','casual'] },
    { code:'MCI-107', sub:'tees', desc:'Polyester/elastane, machine washable', sizes:'S-XL', colors:'All colors', tags:['tee','casual'] },
    { code:'MCI-108', sub:'tees', desc:'Polyester/elastane, machine washable', sizes:'S-XL', colors:'All colors', tags:['tee','casual'] },
    { code:'MCI-109', sub:'tees', desc:'Polyester/elastane, machine washable', sizes:'S-XL', colors:'All colors', tags:['tee','casual'] },
    { code:'MCI-110', sub:'hoodies', desc:'Cotton/poly fleece interior', sizes:'S-2XL', colors:'All colors', tags:['hoodie','casual'] },
    { code:'MCI-111', sub:'hoodies', desc:'Cotton/poly fleece interior', sizes:'S-2XL', colors:'All colors', tags:['hoodie','casual'] },
    { code:'MCI-112', sub:'hoodies', desc:'Cotton/poly fleece interior', sizes:'S-2XL', colors:'All colors', tags:['hoodie','casual'] },
    { code:'MCI-113', sub:'hoodies', desc:'Cotton/poly fleece interior', sizes:'S-2XL', colors:'All colors', tags:['hoodie','casual'] },
    { code:'MCI-114', sub:'hoodies', desc:'Cotton/poly fleece interior', sizes:'S-2XL', colors:'All colors', tags:['hoodie','casual'] },
  ];
  for (const p of cwProds) {
    const sid = await subId(p.sub);
    const slug = makeSlug(p.code, p.sub);
    await Prod.findOneAndUpdate({ code: p.code }, { code: p.code, name: p.sub.replace(/-/g,' ') + ' ' + p.code, slug, categoryId: cw._id, subcategoryId: sid, shortDescription: p.desc, sizes: p.sizes, colors: p.colors, moq: 50, price: null, currency: 'USD', image: '', gallery: [], tags: p.tags, isActive: true, isFeatured: false }, { upsert: true, new: true });
  }
  console.log('Casual Wear products done (36)');

  // Products — Fitness Wear
  const fwProds = [
    { code:'MCI-115', sub:'gym-gloves', desc:'Lycra spandex, breathable, keeps hands dry', sizes:'Not specified', colors:'Not specified', tags:['gym','gloves'] },
    { code:'MCI-116', sub:'gym-gloves', desc:'Lycra spandex, breathable, keeps hands dry', sizes:'Not specified', colors:'Not specified', tags:['gym','gloves'] },
    { code:'MCI-117', sub:'gym-gloves', desc:'Lycra spandex, breathable, keeps hands dry', sizes:'Not specified', colors:'Not specified', tags:['gym','gloves'] },
    { code:'MCI-118', sub:'gym-gloves', desc:'Lycra spandex, breathable, keeps hands dry', sizes:'Not specified', colors:'Not specified', tags:['gym','gloves'] },
    { code:'MCI-119', sub:'gym-straps', desc:'Cotton + rubber, weight lifting straps', sizes:'All sizes', colors:'All colors', tags:['gym','straps'] },
    { code:'MCI-120', sub:'gym-straps', desc:'Cotton + rubber, weight lifting straps', sizes:'All sizes', colors:'All colors', tags:['gym','straps'] },
    { code:'MCI-121', sub:'gym-straps', desc:'Cotton + rubber, weight lifting straps', sizes:'All sizes', colors:'All colors', tags:['gym','straps'] },
    { code:'MCI-122', sub:'gym-straps', desc:'Cotton + rubber, weight lifting straps', sizes:'All sizes', colors:'All colors', tags:['gym','straps'] },
    { code:'MCI-123', sub:'gym-belts', desc:'100% neoprene, hook & loop closure', sizes:'Not specified', colors:'Not specified', tags:['gym','belt'] },
    { code:'MCI-124', sub:'gym-belts', desc:'100% neoprene, hook & loop closure', sizes:'Not specified', colors:'Not specified', tags:['gym','belt'] },
    { code:'MCI-125', sub:'gym-belts', desc:'100% neoprene, hook & loop closure', sizes:'Not specified', colors:'Not specified', tags:['gym','belt'] },
    { code:'MCI-126', sub:'gym-belts', desc:'100% neoprene, hook & loop closure', sizes:'Not specified', colors:'Not specified', tags:['gym','belt'] },
    { code:'MCI-127', sub:'women-singlet', desc:'Lightweight breathable fabric', sizes:'Not specified', colors:'All colors', tags:['women','singlet'] },
    { code:'MCI-128', sub:'women-singlet', desc:'Lightweight breathable fabric', sizes:'Not specified', colors:'All colors', tags:['women','singlet'] },
    { code:'MCI-129', sub:'women-singlet', desc:'Lightweight breathable fabric', sizes:'Not specified', colors:'All colors', tags:['women','singlet'] },
    { code:'MCI-130', sub:'women-singlet', desc:'Lightweight breathable fabric', sizes:'Not specified', colors:'All colors', tags:['women','singlet'] },
    { code:'MCI-131', sub:'women-singlet', desc:'Lightweight breathable fabric', sizes:'Not specified', colors:'All colors', tags:['women','singlet'] },
    { code:'MCI-132', sub:'women-singlet', desc:'Lightweight breathable fabric', sizes:'Not specified', colors:'All colors', tags:['women','singlet'] },
    { code:'MCI-133', sub:'women-singlet', desc:'Lightweight breathable fabric', sizes:'Not specified', colors:'All colors', tags:['women','singlet'] },
    { code:'MCI-134', sub:'women-shorts', desc:'Polyester/spandex blend', sizes:'Not specified', colors:'All colors', tags:['women','shorts'] },
    { code:'MCI-135', sub:'women-shorts', desc:'Polyester/spandex blend', sizes:'Not specified', colors:'All colors', tags:['women','shorts'] },
    { code:'MCI-136', sub:'women-shorts', desc:'Polyester/spandex blend', sizes:'Not specified', colors:'All colors', tags:['women','shorts'] },
    { code:'MCI-137', sub:'women-shorts', desc:'Polyester/spandex blend', sizes:'Not specified', colors:'All colors', tags:['women','shorts'] },
    { code:'MCI-138', sub:'women-shorts', desc:'Polyester/spandex blend', sizes:'Not specified', colors:'All colors', tags:['women','shorts'] },
    { code:'MCI-139', sub:'gym-pants', desc:'Cotton/poly, customizable', sizes:'S-XXL', colors:'Custom colors', tags:['gym','pants'] },
    { code:'MCI-140', sub:'gym-pants', desc:'Polyester/spandex, camouflage options', sizes:'S-XXL', colors:'Black/White camo', tags:['gym','pants'] },
    { code:'MCI-141', sub:'gym-pants', desc:'Cotton/poly blend, unisex custom', sizes:'S-XXL', colors:'Custom colors', tags:['gym','pants'] },
    { code:'MCI-142', sub:'gym-pants', desc:'Polyester/spandex, gym pants', sizes:'S-XXL', colors:'Custom colors', tags:['gym','pants'] },
    { code:'MCI-143', sub:'mens-gym-shorts', desc:'Polyester breathable mesh', sizes:'Not specified', colors:'Custom colors', tags:['men','shorts','gym'] },
    { code:'MCI-144', sub:'mens-gym-shorts', desc:'Polyester breathable mesh', sizes:'Not specified', colors:'Custom colors', tags:['men','shorts','gym'] },
    { code:'MCI-145', sub:'mens-gym-shorts', desc:'Polyester breathable mesh', sizes:'Not specified', colors:'Custom colors', tags:['men','shorts','gym'] },
    { code:'MCI-146', sub:'mens-gym-shorts', desc:'Polyester breathable mesh', sizes:'Not specified', colors:'Custom colors', tags:['men','shorts','gym'] },
    { code:'MCI-147', sub:'leggings', desc:'Polyester/elastane stretch', sizes:'S-XL', colors:'All colors', tags:['leggings','women'] },
    { code:'MCI-148', sub:'leggings', desc:'Polyester/elastane stretch', sizes:'S-XL', colors:'All colors', tags:['leggings','women'] },
    { code:'MCI-149', sub:'leggings', desc:'Polyester/elastane stretch', sizes:'S-XL', colors:'All colors', tags:['leggings','women'] },
    { code:'MCI-150', sub:'leggings', desc:'Polyester/elastane stretch', sizes:'S-XL', colors:'All colors', tags:['leggings','women'] },
    { code:'MCI-151', sub:'leggings', desc:'Polyester/elastane stretch', sizes:'S-XL', colors:'All colors', tags:['leggings','women'] },
  ];
  for (const p of fwProds) {
    const sid = await subId(p.sub);
    const slug = makeSlug(p.code, p.sub);
    await Prod.findOneAndUpdate({ code: p.code }, { code: p.code, name: p.sub.replace(/-/g,' ') + ' ' + p.code, slug, categoryId: fw._id, subcategoryId: sid, shortDescription: p.desc, sizes: p.sizes, colors: p.colors, moq: 50, price: null, currency: 'USD', image: '', gallery: [], tags: p.tags, isActive: true, isFeatured: false }, { upsert: true, new: true });
  }
  console.log('Fitness Wear products done (37)');

  const total = await Prod.countDocuments();
  console.log('Total products in DB:', total);
  await mongoose.disconnect();
  console.log('SEED COMPLETE! Login at /admin/login with admin@megacore.com / Admin@123456');
}

seed().catch(e => { console.error('Seed error:', e.message); process.exit(1); });
