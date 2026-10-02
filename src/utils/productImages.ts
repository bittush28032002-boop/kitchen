/**
 * High-fidelity vector studio photography generator for KitchenCraft
 * Renders authentic studio product shots on warm travertine/clay backdrops
 * matching the visual reference image with soft lighting, drop shadows, and rich textures.
 */

export function generateProductSvg(
  type: string,
  primaryColor: string = '#557A66',
  secondaryColor: string = '#E8DEC8',
  variant: 'front' | 'angle' | 'lifestyle' = 'front'
): string {
  const bg = '#EAE8E1';
  const shadow = 'rgba(25, 35, 28, 0.10)';

  let innerSvg = '';

  switch (type) {
    case 'plate':
    case 'ceramic_plate':
      innerSvg = `
        <ellipse cx="200" cy="275" rx="135" ry="24" fill="${shadow}" filter="blur(7px)" />
        <ellipse cx="200" cy="245" rx="140" ry="48" fill="#D5CFC3" />
        <ellipse cx="200" cy="240" rx="135" ry="44" fill="${primaryColor}" />
        <ellipse cx="200" cy="239" rx="105" ry="32" fill="#BEB8AA" opacity="0.35" />
        <ellipse cx="200" cy="237" rx="96" ry="28" fill="${primaryColor}" />
        <ellipse cx="175" cy="225" rx="65" ry="16" fill="#FFFFFF" opacity="0.22" filter="blur(3px)" />
      `;
      break;

    case 'black_plate':
      innerSvg = `
        <ellipse cx="200" cy="275" rx="135" ry="24" fill="${shadow}" filter="blur(7px)" />
        <ellipse cx="200" cy="245" rx="140" ry="48" fill="#1C1E1D" />
        <ellipse cx="200" cy="240" rx="135" ry="44" fill="${primaryColor || '#222523'}" />
        <ellipse cx="200" cy="239" rx="105" ry="32" fill="#151716" />
        <ellipse cx="200" cy="237" rx="96" ry="28" fill="${primaryColor || '#2B2F2C'}" />
        <ellipse cx="170" cy="225" rx="60" ry="14" fill="#FFFFFF" opacity="0.14" filter="blur(4px)" />
      `;
      break;

    case 'floral_set':
    case 'dinner_set':
      innerSvg = `
        <ellipse cx="200" cy="285" rx="130" ry="22" fill="${shadow}" filter="blur(7px)" />
        <!-- Large plate -->
        <ellipse cx="200" cy="250" rx="130" ry="44" fill="#E6E0D2" />
        <ellipse cx="200" cy="246" rx="124" ry="40" fill="${secondaryColor}" />
        <!-- Salad plate stacked -->
        <ellipse cx="200" cy="230" rx="95" ry="30" fill="#DDD7C8" />
        <ellipse cx="200" cy="227" rx="90" ry="27" fill="${primaryColor}" />
        <!-- Delicate botanical pattern on center plate -->
        <path d="M 180 220 Q 200 210 220 220" stroke="#FFFFFF" stroke-width="2" fill="none" opacity="0.6"/>
        <circle cx="190" cy="224" r="3" fill="#FFFFFF" opacity="0.7"/>
        <circle cx="210" cy="224" r="3" fill="#FFFFFF" opacity="0.7"/>
        <!-- Small nested bowl on top -->
        <ellipse cx="200" cy="205" rx="55" ry="18" fill="#D3CCA" />
        <path d="M 155 205 Q 160 225 200 225 Q 240 225 245 205 Z" fill="${secondaryColor}" />
        <ellipse cx="200" cy="204" rx="45" ry="12" fill="#FAF8F5" />
      `;
      break;

    case 'soup_bowl':
    case 'bowl':
      innerSvg = `
        <ellipse cx="200" cy="285" rx="110" ry="22" fill="${shadow}" filter="blur(7px)" />
        <!-- Bowl outer body -->
        <path d="M 90 190 Q 95 280 200 280 Q 305 280 310 190 Z" fill="${primaryColor}" />
        <ellipse cx="200" cy="190" rx="110" ry="35" fill="#D2CCC0" />
        <ellipse cx="200" cy="190" rx="104" ry="31" fill="${secondaryColor}" />
        <ellipse cx="195" cy="192" rx="90" ry="25" fill="#C4BCAE" opacity="0.35" />
        <!-- highlight -->
        <path d="M 110 205 Q 120 255 190 265" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.25" filter="blur(2px)" />
      `;
      break;

    case 'pasta_bowl':
      innerSvg = `
        <ellipse cx="200" cy="280" rx="130" ry="24" fill="${shadow}" filter="blur(8px)" />
        <!-- Low, wide shallow wall -->
        <path d="M 75 210 Q 85 275 200 275 Q 315 275 325 210 Z" fill="${primaryColor}" />
        <ellipse cx="200" cy="210" rx="125" ry="38" fill="#D5CFC2" />
        <ellipse cx="200" cy="208" rx="118" ry="34" fill="${primaryColor}" />
        <ellipse cx="200" cy="212" rx="80" ry="22" fill="${secondaryColor}" opacity="0.6" />
        <!-- Sheen -->
        <path d="M 95 225 Q 115 255 180 265" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.22" />
      `;
      break;

    case 'glass_bowl':
      innerSvg = `
        <ellipse cx="200" cy="285" rx="110" ry="22" fill="${shadow}" filter="blur(7px)" />
        <!-- Clear glass salad bowl with optic refraction -->
        <path d="M 95 180 Q 100 275 200 275 Q 300 275 305 180 Z" fill="#D4E5DE" opacity="0.45" />
        <ellipse cx="200" cy="180" rx="105" ry="32" fill="#E8F4EE" opacity="0.7" />
        <path d="M 100 185 Q 105 270 200 270 Q 295 270 300 185" stroke="#FFFFFF" stroke-width="3" fill="none" opacity="0.8" />
        <!-- Specular highlights -->
        <path d="M 115 195 Q 125 245 180 260" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.5" filter="blur(2px)" />
      `;
      break;

    case 'bamboo_bowl':
      innerSvg = `
        <ellipse cx="200" cy="285" rx="115" ry="22" fill="${shadow}" filter="blur(7px)" />
        <path d="M 85 190 Q 90 278 200 278 Q 310 278 315 190 Z" fill="${primaryColor || '#BD8E5D'}" />
        <ellipse cx="200" cy="190" rx="115" ry="34" fill="#A87747" />
        <ellipse cx="200" cy="189" rx="108" ry="30" fill="${secondaryColor || '#D4A470'}" />
        <!-- Wood grain stripes -->
        <path d="M 105 210 Q 120 250 180 265" stroke="#96673B" stroke-width="2.5" fill="none" opacity="0.6"/>
        <path d="M 130 205 Q 145 255 205 270" stroke="#96673B" stroke-width="2.5" fill="none" opacity="0.6"/>
      `;
      break;

    case 'mug':
    case 'coffee_mug':
      innerSvg = `
        <ellipse cx="200" cy="295" rx="80" ry="18" fill="${shadow}" filter="blur(6px)" />
        <!-- Handle -->
        <path d="M 255 170 C 315 170 315 255 255 255" fill="none" stroke="${primaryColor}" stroke-width="16" stroke-linecap="round" />
        <path d="M 255 170 C 315 170 315 255 255 255" fill="none" stroke="#FFFFFF" stroke-width="3" opacity="0.25" stroke-linecap="round" />
        <!-- Body -->
        <rect x="135" y="150" width="130" height="135" rx="16" fill="${primaryColor}" />
        <ellipse cx="200" cy="150" rx="65" ry="18" fill="#E8DEC8" />
        <ellipse cx="200" cy="150" rx="58" ry="14" fill="#3D2B1F" />
        <!-- Glaze sheen -->
        <path d="M 148 165 L 148 265" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" opacity="0.22" filter="blur(2px)" />
      `;
      break;

    case 'double_wall_mug':
      innerSvg = `
        <ellipse cx="200" cy="295" rx="75" ry="16" fill="${shadow}" filter="blur(6px)" />
        <!-- Outer glass -->
        <rect x="135" y="150" width="130" height="135" rx="20" fill="#E1EFEA" opacity="0.35" />
        <rect x="136" y="151" width="128" height="133" rx="19" stroke="#FFFFFF" stroke-width="2.5" fill="none" opacity="0.8" />
        <!-- Inner suspended glass layer -->
        <rect x="150" y="160" width="100" height="110" rx="14" fill="${primaryColor || '#D6B48D'}" opacity="0.6" />
        <!-- Handle -->
        <path d="M 265 175 C 310 175 310 240 265 240" fill="none" stroke="#FFFFFF" stroke-width="6" opacity="0.7" stroke-linecap="round" />
        <path d="M 146 165 L 146 265" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity="0.6" />
      `;
      break;

    case 'tea_set':
      innerSvg = `
        <ellipse cx="200" cy="295" rx="110" ry="22" fill="${shadow}" filter="blur(8px)" />
        <!-- Teapot -->
        <ellipse cx="185" cy="225" rx="65" ry="50" fill="${primaryColor}" />
        <path d="M 235 190 C 285 190 285 245 235 245" stroke="${primaryColor}" stroke-width="12" fill="none" stroke-linecap="round" />
        <path d="M 130 215 Q 100 205 105 175" stroke="${primaryColor}" stroke-width="14" fill="none" stroke-linecap="round" />
        <!-- Brass arch handle -->
        <path d="M 150 180 C 150 115 220 115 220 180" stroke="#D4AF37" stroke-width="6" fill="none" stroke-linecap="round" />
        <!-- Small matching cup -->
        <path d="M 260 240 Q 262 275 285 275 Q 308 275 310 240 Z" fill="${secondaryColor}" />
        <ellipse cx="285" cy="240" rx="25" ry="8" fill="#422E1F" />
      `;
      break;

    case 'espresso_cup':
      innerSvg = `
        <ellipse cx="200" cy="290" rx="70" ry="16" fill="${shadow}" filter="blur(5px)" />
        <!-- Saucer -->
        <ellipse cx="200" cy="270" rx="65" ry="16" fill="#DCD6C7" />
        <ellipse cx="200" cy="268" rx="60" ry="14" fill="${secondaryColor}" />
        <!-- Cup -->
        <path d="M 165 200 L 175 265 L 225 265 L 235 200 Z" fill="${primaryColor}" rx="4" />
        <ellipse cx="200" cy="200" rx="35" ry="10" fill="#FAF8F5" />
        <ellipse cx="200" cy="200" rx="30" ry="8" fill="#3D2617" />
        <path d="M 230 210 C 255 210 255 250 228 250" fill="none" stroke="${primaryColor}" stroke-width="6" stroke-linecap="round" />
      `;
      break;

    case 'crystal_glasses':
    case 'glassware':
      innerSvg = `
        <ellipse cx="200" cy="295" rx="65" ry="15" fill="${shadow}" filter="blur(6px)" />
        <!-- Stem & Base -->
        <ellipse cx="200" cy="290" rx="45" ry="10" fill="#DDECE6" opacity="0.8" />
        <rect x="196" y="210" width="8" height="80" rx="3" fill="#D4DFDA" opacity="0.8" />
        <!-- Glass Bowl with sheer facet cuts -->
        <path d="M 150 130 Q 150 215 200 215 Q 250 215 250 130 Z" fill="#DFF0E8" opacity="0.45" />
        <ellipse cx="200" cy="130" rx="50" ry="14" fill="#EEF7F3" opacity="0.7" />
        <path d="M 158 145 Q 160 200 195 208" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.7" />
      `;
      break;

    case 'highball_glass':
      innerSvg = `
        <ellipse cx="200" cy="295" rx="55" ry="14" fill="${shadow}" filter="blur(6px)" />
        <rect x="160" y="125" width="80" height="165" rx="10" fill="#E2EDE8" opacity="0.5" />
        <ellipse cx="200" cy="125" rx="40" ry="10" fill="#F4FAF7" />
        <!-- Vertical fluting grooves -->
        <line x1="172" y1="135" x2="172" y2="280" stroke="#FFFFFF" stroke-width="2" opacity="0.7" />
        <line x1="186" y1="135" x2="186" y2="280" stroke="#FFFFFF" stroke-width="2" opacity="0.7" />
        <line x1="200" y1="135" x2="200" y2="280" stroke="#FFFFFF" stroke-width="2" opacity="0.7" />
        <line x1="214" y1="135" x2="214" y2="280" stroke="#FFFFFF" stroke-width="2" opacity="0.7" />
        <line x1="228" y1="135" x2="228" y2="280" stroke="#FFFFFF" stroke-width="2" opacity="0.7" />
      `;
      break;

    case 'platter':
      innerSvg = `
        <ellipse cx="200" cy="280" rx="145" ry="25" fill="${shadow}" filter="blur(8px)" />
        <ellipse cx="200" cy="245" rx="150" ry="45" fill="#D4CDC0" />
        <ellipse cx="200" cy="242" rx="142" ry="40" fill="${primaryColor}" />
        <ellipse cx="200" cy="242" rx="115" ry="28" fill="${secondaryColor}" opacity="0.4" />
        <ellipse cx="170" cy="230" rx="70" ry="14" fill="#FFFFFF" opacity="0.22" filter="blur(3px)" />
      `;
      break;

    case 'cookware_pan':
    case 'frying_pan':
      innerSvg = `
        <ellipse cx="200" cy="285" rx="130" ry="24" fill="${shadow}" filter="blur(8px)" />
        <!-- Handle -->
        <path d="M 60 210 L 130 230" stroke="#222" stroke-width="18" stroke-linecap="round" />
        <path d="M 60 210 L 130 230" stroke="#997A52" stroke-width="12" stroke-linecap="round" />
        <!-- Pan Body -->
        <ellipse cx="230" cy="235" rx="105" ry="42" fill="${primaryColor}" />
        <ellipse cx="230" cy="230" rx="98" ry="36" fill="#1C1E1D" />
        <ellipse cx="230" cy="230" rx="88" ry="30" fill="#292D2A" />
        <!-- Speckles -->
        <circle cx="210" cy="225" r="1.5" fill="#E5E5E5" opacity="0.6"/>
        <circle cx="240" cy="235" r="1.5" fill="#E5E5E5" opacity="0.6"/>
        <circle cx="250" cy="220" r="1.5" fill="#E5E5E5" opacity="0.6"/>
      `;
      break;

    case 'cast_iron_skillet':
      innerSvg = `
        <ellipse cx="200" cy="285" rx="130" ry="24" fill="${shadow}" filter="blur(8px)" />
        <!-- Cast iron handle with hanging hole -->
        <path d="M 55 210 L 130 230" stroke="#1C1E1D" stroke-width="18" stroke-linecap="round" />
        <circle cx="68" cy="214" r="4" fill="#EAE8E1" />
        <!-- Pan Body -->
        <ellipse cx="230" cy="235" rx="105" ry="42" fill="#1C1E1D" />
        <ellipse cx="230" cy="230" rx="98" ry="36" fill="#262827" />
        <ellipse cx="230" cy="230" rx="88" ry="30" fill="#181A19" />
        <!-- Spout -->
        <path d="M 230 270 Q 230 278 240 272" stroke="#1C1E1D" stroke-width="4" />
      `;
      break;

    case 'saucepan':
      innerSvg = `
        <ellipse cx="200" cy="290" rx="110" ry="22" fill="${shadow}" filter="blur(7px)" />
        <!-- Steel handle -->
        <path d="M 60 190 L 135 220" stroke="#A8B4B1" stroke-width="14" stroke-linecap="round" />
        <!-- Saucepan Body -->
        <path d="M 135 210 L 140 280 L 270 280 L 275 210 Z" fill="${primaryColor || '#CFD7D5'}" />
        <ellipse cx="205" cy="210" rx="70" ry="20" fill="#BCC8C5" />
        <!-- Glass/Steel lid -->
        <ellipse cx="205" cy="205" rx="68" ry="18" fill="#E8F0EC" opacity="0.7" />
        <circle cx="205" cy="192" r="7" fill="#889692" />
        <!-- Reflection -->
        <path d="M 155 220 L 155 270" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity="0.5" />
      `;
      break;

    case 'dutch_oven':
      innerSvg = `
        <ellipse cx="200" cy="295" rx="120" ry="25" fill="${shadow}" filter="blur(8px)" />
        <!-- Side handles -->
        <rect x="75" y="195" width="30" height="14" rx="7" fill="${primaryColor}" />
        <rect x="295" y="195" width="30" height="14" rx="7" fill="${primaryColor}" />
        <!-- Pot base -->
        <path d="M 95 185 Q 98 280 200 280 Q 302 280 305 185 Z" fill="${primaryColor}" />
        <!-- Pot Rim -->
        <ellipse cx="200" cy="185" rx="105" ry="24" fill="${primaryColor}" />
        <!-- Lid -->
        <path d="M 100 180 Q 200 120 300 180 Z" fill="${primaryColor}" />
        <ellipse cx="200" cy="180" rx="100" ry="20" fill="${primaryColor}" />
        <!-- Brass Knob -->
        <ellipse cx="200" cy="142" rx="18" ry="8" fill="#D4AF37" />
        <rect x="194" y="145" width="12" height="10" fill="#B38F22" />
        <!-- Sheen -->
        <path d="M 130 190 Q 150 250 185 265" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.25" filter="blur(2px)" />
      `;
      break;

    case 'cookware_set':
      innerSvg = `
        <ellipse cx="200" cy="295" rx="135" ry="24" fill="${shadow}" filter="blur(8px)" />
        <!-- Back pot (e.g. lime/olive) -->
        <path d="M 110 160 L 115 250 L 220 250 L 225 160 Z" fill="${primaryColor || '#96A838'}" />
        <ellipse cx="167" cy="160" rx="58" ry="16" fill="${primaryColor || '#96A838'}" />
        <rect x="85" y="175" width="25" height="12" rx="6" fill="#1C1E1D" />
        <!-- Front smaller casserole (terracotta / orange like reference image!) -->
        <path d="M 195 210 L 200 280 L 290 280 L 295 210 Z" fill="${secondaryColor || '#C96E3D'}" />
        <ellipse cx="245" cy="210" rx="50" ry="14" fill="${secondaryColor || '#C96E3D'}" />
        <rect x="295" y="225" width="22" height="10" rx="5" fill="#1C1E1D" />
        <ellipse cx="245" cy="195" rx="42" ry="12" fill="#EAE5DB" opacity="0.8" />
        <circle cx="245" cy="185" r="5" fill="#1C1E1D" />
      `;
      break;

    case 'kadhai':
      innerSvg = `
        <ellipse cx="200" cy="290" rx="120" ry="22" fill="${shadow}" filter="blur(7px)" />
        <!-- Dual heavy stainless loop handles -->
        <path d="M 80 200 C 60 170 100 170 95 210" stroke="#8E9B98" stroke-width="8" fill="none" stroke-linecap="round" />
        <path d="M 320 200 C 340 170 300 170 305 210" stroke="#8E9B98" stroke-width="8" fill="none" stroke-linecap="round" />
        <!-- Deep curved bowl -->
        <path d="M 95 200 Q 100 285 200 285 Q 300 285 305 200 Z" fill="${primaryColor || '#C6D0CE'}" />
        <ellipse cx="200" cy="200" rx="105" ry="26" fill="#AFC0BD" />
        <ellipse cx="200" cy="200" rx="98" ry="22" fill="#DDE4E2" />
      `;
      break;

    case 'wok':
      innerSvg = `
        <ellipse cx="200" cy="290" rx="125" ry="22" fill="${shadow}" filter="blur(7px)" />
        <!-- Acacia wooden stick handle -->
        <path d="M 50 160 L 110 205" stroke="#996D44" stroke-width="16" stroke-linecap="round" />
        <!-- Helper loop handle on other side -->
        <path d="M 300 215 C 330 210 330 230 300 235" stroke="#1C1E1D" stroke-width="6" fill="none" />
        <!-- Spun carbon steel wok bowl -->
        <path d="M 105 205 Q 115 285 205 285 Q 295 285 305 205 Z" fill="${primaryColor || '#2A3036'}" />
        <ellipse cx="205" cy="205" rx="100" ry="28" fill="#1F2327" />
        <ellipse cx="205" cy="205" rx="90" ry="24" fill="#353D45" />
      `;
      break;

    case 'pressure_cooker':
      innerSvg = `
        <ellipse cx="200" cy="295" rx="105" ry="22" fill="${shadow}" filter="blur(7px)" />
        <!-- Cooker base -->
        <rect x="130" y="170" width="140" height="115" rx="16" fill="${primaryColor || '#C2CCC9'}" />
        <ellipse cx="200" cy="170" rx="70" ry="18" fill="#A5B3B0" />
        <!-- Long handle with safety locking latch -->
        <rect x="40" y="160" width="100" height="18" rx="6" fill="#1C1E1D" />
        <!-- Heavy sealed lid & regulator weight -->
        <path d="M 130 170 Q 200 130 270 170 Z" fill="#D2DBD9" />
        <rect x="195" y="125" width="10" height="20" fill="#1C1E1D" />
        <circle cx="200" cy="122" r="8" fill="#1C1E1D" />
      `;
      break;

    case 'tawa':
      innerSvg = `
        <ellipse cx="200" cy="285" rx="135" ry="24" fill="${shadow}" filter="blur(8px)" />
        <path d="M 60 210 L 135 235" stroke="#1C1E1D" stroke-width="16" stroke-linecap="round" />
        <ellipse cx="230" cy="240" rx="110" ry="40" fill="${primaryColor || '#1C1E1D'}" />
        <ellipse cx="230" cy="238" rx="104" ry="36" fill="#2E3330" />
      `;
      break;

    case 'knife':
    case 'chef_knife':
      innerSvg = `
        <ellipse cx="200" cy="290" rx="130" ry="16" fill="${shadow}" filter="blur(7px)" />
        <!-- Wooden Handle -->
        <path d="M 60 215 L 140 215 L 140 240 L 60 240 Z" fill="${primaryColor || '#5E412E'}" rx="5" />
        <circle cx="85" cy="227" r="3" fill="#D4AF37" />
        <circle cx="115" cy="227" r="3" fill="#D4AF37" />
        <!-- Bolster -->
        <rect x="140" y="212" width="8" height="32" rx="2" fill="#B0B5B3" />
        <!-- Damascus Steel Blade -->
        <path d="M 148 212 L 320 220 Q 345 226 310 248 L 148 244 Z" fill="url(#steelGrad)" />
        <path d="M 152 216 L 310 223" stroke="#FFFFFF" stroke-width="2" opacity="0.6" />
      `;
      break;

    case 'cutting_board':
      innerSvg = `
        <ellipse cx="200" cy="295" rx="125" ry="25" fill="${shadow}" filter="blur(9px)" />
        <rect x="85" y="125" width="230" height="150" rx="24" fill="${primaryColor || '#C29468'}" />
        <rect x="90" y="120" width="220" height="145" rx="20" fill="${secondaryColor || '#DDB082'}" />
        <!-- Wood grain details -->
        <path d="M 110 135 C 130 160 120 210 115 250" stroke="#B88A5E" stroke-width="2" fill="none" opacity="0.5"/>
        <path d="M 160 130 C 175 170 170 215 165 255" stroke="#B88A5E" stroke-width="2.5" fill="none" opacity="0.5"/>
        <path d="M 215 130 C 230 175 225 210 220 255" stroke="#B88A5E" stroke-width="2" fill="none" opacity="0.5"/>
        <!-- Ring -->
        <circle cx="280" cy="145" r="10" fill="#EAE8E1" />
        <circle cx="280" cy="145" r="10" stroke="#A67C52" stroke-width="2" fill="none" />
      `;
      break;

    case 'spatula_set':
    case 'utensil_holder':
    case 'utensils_holder':
      innerSvg = `
        <ellipse cx="200" cy="305" rx="75" ry="18" fill="${shadow}" filter="blur(7px)" />
        <!-- Spoons & spatulas sticking out (like yellow utensil canister in reference image!) -->
        <path d="M 170 80 Q 160 120 180 180" stroke="#BD8E62" stroke-width="12" stroke-linecap="round" fill="none" />
        <ellipse cx="165" cy="75" rx="16" ry="24" fill="#C99B6D" transform="rotate(-15 165 75)" />
        <path d="M 230 70 Q 220 120 215 180" stroke="#A87A50" stroke-width="10" stroke-linecap="round" fill="none" />
        <ellipse cx="235" cy="65" rx="14" ry="22" fill="#B5875D" transform="rotate(20 235 65)" />
        <path d="M 200 60 L 200 180" stroke="#C4966B" stroke-width="12" stroke-linecap="round" />
        <rect x="188" y="50" width="24" height="40" rx="4" fill="${secondaryColor || '#DDB082'}" />
        <!-- Ceramic canister body -->
        <rect x="150" y="165" width="100" height="130" rx="16" fill="${primaryColor || '#D4A437'}" />
        <ellipse cx="200" cy="165" rx="50" ry="14" fill="#E5B94C" />
        <!-- Sheen -->
        <path d="M 162 180 L 162 285" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity="0.32" filter="blur(2px)" />
      `;
      break;

    case 'whisk':
      innerSvg = `
        <ellipse cx="200" cy="295" rx="60" ry="14" fill="${shadow}" filter="blur(5px)" />
        <rect x="192" y="195" width="16" height="90" rx="8" fill="#1C1E1D" />
        <ellipse cx="200" cy="140" rx="45" ry="60" fill="none" stroke="#A8B4B0" stroke-width="3" />
        <ellipse cx="200" cy="140" rx="30" ry="60" fill="none" stroke="#A8B4B0" stroke-width="2.5" />
        <ellipse cx="200" cy="140" rx="15" ry="60" fill="none" stroke="#A8B4B0" stroke-width="2.5" />
      `;
      break;

    case 'tongs':
      innerSvg = `
        <ellipse cx="200" cy="295" rx="80" ry="15" fill="${shadow}" filter="blur(5px)" />
        <path d="M 160 280 L 195 100 L 205 100 L 240 280" stroke="${primaryColor || '#324F3F'}" stroke-width="14" stroke-linecap="round" fill="none" />
        <rect x="190" y="90" width="20" height="20" rx="4" fill="#D4AF37" />
        <ellipse cx="160" cy="280" rx="14" ry="10" fill="#1C1E1D" />
        <ellipse cx="240" cy="280" rx="14" ry="10" fill="#1C1E1D" />
      `;
      break;

    case 'peeler':
      innerSvg = `
        <ellipse cx="200" cy="290" rx="60" ry="14" fill="${shadow}" filter="blur(5px)" />
        <rect x="190" y="190" width="20" height="95" rx="10" fill="${primaryColor || '#5E7D6D'}" />
        <path d="M 160 140 L 195 190 L 205 190 L 240 140" stroke="${primaryColor || '#5E7D6D'}" stroke-width="12" fill="none" stroke-linecap="round" />
        <line x1="160" y1="140" x2="240" y2="140" stroke="#CFD7D5" stroke-width="4" />
      `;
      break;

    case 'garlic_press':
      innerSvg = `
        <ellipse cx="200" cy="290" rx="85" ry="15" fill="${shadow}" filter="blur(6px)" />
        <rect x="120" y="210" width="130" height="22" rx="11" fill="#4B5350" transform="rotate(-10 120 210)" />
        <rect x="120" y="235" width="130" height="22" rx="11" fill="#4B5350" transform="rotate(5 120 235)" />
        <rect x="230" y="200" width="40" height="40" rx="8" fill="#66706D" />
      `;
      break;

    case 'citrus_juicer':
      innerSvg = `
        <ellipse cx="200" cy="290" rx="90" ry="16" fill="${shadow}" filter="blur(6px)" />
        <path d="M 100 230 L 200 230" stroke="#3D5647" stroke-width="16" stroke-linecap="round" />
        <path d="M 100 215 L 200 205" stroke="#3D5647" stroke-width="16" stroke-linecap="round" />
        <circle cx="230" cy="225" r="35" fill="${primaryColor || '#465B47'}" />
        <ellipse cx="230" cy="225" rx="25" ry="15" fill="#EBDC9D" />
      `;
      break;

    case 'measuring_cups':
      innerSvg = `
        <ellipse cx="200" cy="290" rx="95" ry="18" fill="${shadow}" filter="blur(6px)" />
        <!-- Nesting cups -->
        <path d="M 140 220 L 150 280 L 250 280 L 260 220 Z" fill="#BFCAC7" />
        <ellipse cx="200" cy="220" rx="60" ry="16" fill="#DCE5E2" />
        <path d="M 260 230 L 330 230" stroke="#A8B4B1" stroke-width="10" stroke-linecap="round" />
        <circle cx="320" cy="230" r="4" fill="#D4AF37" />
      `;
      break;

    case 'grater':
      innerSvg = `
        <ellipse cx="200" cy="295" rx="70" ry="15" fill="${shadow}" filter="blur(6px)" />
        <!-- Wood handle -->
        <rect x="188" y="200" width="24" height="90" rx="8" fill="#6B4B32" />
        <!-- Rasp blade -->
        <rect x="180" y="90" width="40" height="120" rx="6" fill="url(#steelGrad)" />
        <line x1="190" y1="110" x2="210" y2="110" stroke="#444" stroke-width="2" />
        <line x1="190" y1="130" x2="210" y2="130" stroke="#444" stroke-width="2" />
        <line x1="190" y1="150" x2="210" y2="150" stroke="#444" stroke-width="2" />
        <line x1="190" y1="170" x2="210" y2="170" stroke="#444" stroke-width="2" />
      `;
      break;

    case 'storage_jar':
    case 'food_storage':
      innerSvg = `
        <ellipse cx="200" cy="300" rx="75" ry="18" fill="${shadow}" filter="blur(6px)" />
        <!-- Glass body -->
        <rect x="140" y="130" width="120" height="160" rx="18" fill="#E3EAE6" opacity="0.45" />
        <rect x="142" y="132" width="116" height="154" rx="16" stroke="#FFFFFF" stroke-width="3" fill="none" opacity="0.8" />
        <!-- Contents inside jar -->
        <path d="M 144 200 Q 200 210 256 200 L 256 280 Q 200 290 144 280 Z" fill="${primaryColor}" opacity="0.75" />
        <!-- Wood Lid -->
        <rect x="135" y="105" width="130" height="28" rx="8" fill="#C49B70" />
        <ellipse cx="200" cy="105" rx="65" ry="12" fill="#D6AF85" />
      `;
      break;

    case 'bread_box':
      innerSvg = `
        <ellipse cx="200" cy="295" rx="125" ry="24" fill="${shadow}" filter="blur(8px)" />
        <rect x="90" y="160" width="220" height="125" rx="18" fill="${primaryColor || '#274433'}" />
        <ellipse cx="200" cy="160" rx="110" ry="24" fill="#BD8E5D" />
        <circle cx="200" cy="148" r="8" fill="#996D44" />
      `;
      break;

    case 'bottle':
    case 'insulated_bottle':
    case 'water_bottle':
      innerSvg = `
        <ellipse cx="200" cy="305" rx="65" ry="16" fill="${shadow}" filter="blur(6px)" />
        <!-- Bottle body (exact proportions like teal/green bottle in reference image!) -->
        <rect x="150" y="120" width="100" height="175" rx="26" fill="${primaryColor || '#4A6D5B'}" />
        <!-- Cap / loop -->
        <rect x="175" y="90" width="50" height="32" rx="6" fill="#D6CEBE" />
        <path d="M 190 70 C 190 55 210 55 210 70 L 210 90 L 190 90 Z" fill="#4A453F" />
        <!-- Minimal symbol on bottle matching reference image -->
        <circle cx="200" cy="180" r="10" stroke="#FFFFFF" stroke-width="2" fill="none" opacity="0.45" />
        <circle cx="200" cy="198" r="10" stroke="#FFFFFF" stroke-width="2" fill="none" opacity="0.45" />
        <!-- Light reflection on side -->
        <path d="M 162 135 L 162 280" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" opacity="0.25" filter="blur(2px)" />
      `;
      break;

    case 'kettle':
      innerSvg = `
        <ellipse cx="200" cy="305" rx="90" ry="20" fill="${shadow}" filter="blur(7px)" />
        <ellipse cx="200" cy="285" rx="75" ry="16" fill="#C4986C" />
        <!-- Fluted body matching reference image sage electric kettle -->
        <path d="M 140 275 L 155 130 L 245 130 L 260 275 Z" fill="${primaryColor || '#618571'}" />
        <!-- Fluting lines -->
        <line x1="165" y1="135" x2="155" y2="275" stroke="#FFFFFF" stroke-width="1.5" opacity="0.3" />
        <line x1="180" y1="132" x2="175" y2="275" stroke="#FFFFFF" stroke-width="1.5" opacity="0.3" />
        <line x1="200" y1="130" x2="200" y2="275" stroke="#FFFFFF" stroke-width="1.5" opacity="0.3" />
        <line x1="220" y1="132" x2="225" y2="275" stroke="#FFFFFF" stroke-width="1.5" opacity="0.3" />
        <line x1="235" y1="135" x2="245" y2="275" stroke="#FFFFFF" stroke-width="1.5" opacity="0.3" />
        <!-- Spout -->
        <path d="M 150 170 Q 110 160 115 130 Q 120 125 125 130 Q 125 150 152 155 Z" fill="${primaryColor || '#618571'}" />
        <!-- Handle -->
        <path d="M 245 140 C 295 150 295 240 255 260" stroke="#B88A5E" stroke-width="14" stroke-linecap="round" fill="none" />
        <!-- Lid -->
        <ellipse cx="200" cy="130" rx="46" ry="12" fill="${primaryColor || '#618571'}" />
        <circle cx="200" cy="116" r="8" fill="#D4AF37" />
      `;
      break;

    default:
      innerSvg = `
        <ellipse cx="200" cy="290" rx="100" ry="20" fill="${shadow}" filter="blur(8px)" />
        <rect x="130" y="140" width="140" height="140" rx="20" fill="${primaryColor}" />
        <ellipse cx="200" cy="140" rx="70" ry="20" fill="${secondaryColor}" />
        <path d="M 145 160 L 145 260" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity="0.25" filter="blur(2px)" />
      `;
  }

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 380" width="100%" height="100%">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#EAE7E0" />
          <stop offset="60%" stop-color="#E5E2DA" />
          <stop offset="100%" stop-color="#DDD8CF" />
        </linearGradient>
        <linearGradient id="steelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#EBEFEF" />
          <stop offset="40%" stop-color="#CFD6D4" />
          <stop offset="70%" stop-color="#A5B0AD" />
          <stop offset="100%" stop-color="#E2E7E6" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bgGrad)" />
      <!-- Subtle travertine pedestal circle -->
      <ellipse cx="200" cy="275" rx="160" ry="50" fill="#DDD7CB" opacity="0.55" />
      ${innerSvg}
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
}
