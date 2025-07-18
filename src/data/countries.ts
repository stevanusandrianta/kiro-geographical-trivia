export interface Country {
  name: string;
  capital: string;
  continent: string;
  subContinent: string;
  population: number;
  mainLanguage: string;
  mainAirport: string;
  currency: string;
  area: number; // in km²
  flagEmoji: string;
}

export const countries: Country[] = [
  // North America
  {
    name: "United States",
    capital: "Washington D.C.",
    continent: "North America",
    subContinent: "Northern America",
    population: 331900000,
    mainLanguage: "English",
    mainAirport: "John F. Kennedy International Airport (JFK)",
    currency: "US Dollar",
    area: 9833517,
    flagEmoji: "🇺🇸"
  },
  {
    name: "Canada",
    capital: "Ottawa",
    continent: "North America",
    subContinent: "Northern America",
    population: 38000000,
    mainLanguage: "English/French",
    mainAirport: "Toronto Pearson International Airport (YYZ)",
    currency: "Canadian Dollar",
    area: 9984670,
    flagEmoji: "🇨🇦"
  },
  {
    name: "Mexico",
    capital: "Mexico City",
    continent: "North America",
    subContinent: "Central America",
    population: 128900000,
    mainLanguage: "Spanish",
    mainAirport: "Mexico City International Airport (MEX)",
    currency: "Mexican Peso",
    area: 1964375,
    flagEmoji: "🇲🇽"
  },
  
  // South America
  {
    name: "Brazil",
    capital: "Brasília",
    continent: "South America",
    subContinent: "South America",
    population: 215300000,
    mainLanguage: "Portuguese",
    mainAirport: "São Paulo–Guarulhos International Airport (GRU)",
    currency: "Brazilian Real",
    area: 8514877,
    flagEmoji: "🇧🇷"
  },
  {
    name: "Argentina",
    capital: "Buenos Aires",
    continent: "South America",
    subContinent: "South America",
    population: 45400000,
    mainLanguage: "Spanish",
    mainAirport: "Ezeiza International Airport (EZE)",
    currency: "Argentine Peso",
    area: 2780400,
    flagEmoji: "🇦🇷"
  },
  {
    name: "Chile",
    capital: "Santiago",
    continent: "South America",
    subContinent: "South America",
    population: 19100000,
    mainLanguage: "Spanish",
    mainAirport: "Arturo Merino Benítez International Airport (SCL)",
    currency: "Chilean Peso",
    area: 756096,
    flagEmoji: "🇨🇱"
  },
  
  // Europe
  {
    name: "United Kingdom",
    capital: "London",
    continent: "Europe",
    subContinent: "Northern Europe",
    population: 67500000,
    mainLanguage: "English",
    mainAirport: "Heathrow Airport (LHR)",
    currency: "British Pound",
    area: 243610,
    flagEmoji: "🇬🇧"
  },
  {
    name: "France",
    capital: "Paris",
    continent: "Europe",
    subContinent: "Western Europe",
    population: 67800000,
    mainLanguage: "French",
    mainAirport: "Charles de Gaulle Airport (CDG)",
    currency: "Euro",
    area: 643801,
    flagEmoji: "🇫🇷"
  },
  {
    name: "Germany",
    capital: "Berlin",
    continent: "Europe",
    subContinent: "Western Europe",
    population: 83200000,
    mainLanguage: "German",
    mainAirport: "Frankfurt Airport (FRA)",
    currency: "Euro",
    area: 357022,
    flagEmoji: "🇩🇪"
  },
  {
    name: "Italy",
    capital: "Rome",
    continent: "Europe",
    subContinent: "Southern Europe",
    population: 59500000,
    mainLanguage: "Italian",
    mainAirport: "Leonardo da Vinci International Airport (FCO)",
    currency: "Euro",
    area: 301340,
    flagEmoji: "🇮🇹"
  },
  {
    name: "Spain",
    capital: "Madrid",
    continent: "Europe",
    subContinent: "Southern Europe",
    population: 47400000,
    mainLanguage: "Spanish",
    mainAirport: "Adolfo Suárez Madrid–Barajas Airport (MAD)",
    currency: "Euro",
    area: 505370,
    flagEmoji: "🇪🇸"
  },  

  // Asia
  {
    name: "China",
    capital: "Beijing",
    continent: "Asia",
    subContinent: "Eastern Asia",
    population: 1439300000,
    mainLanguage: "Mandarin Chinese",
    mainAirport: "Beijing Capital International Airport (PEK)",
    currency: "Chinese Yuan",
    area: 9596960,
    flagEmoji: "🇨🇳"
  },
  {
    name: "Japan",
    capital: "Tokyo",
    continent: "Asia",
    subContinent: "Eastern Asia",
    population: 125800000,
    mainLanguage: "Japanese",
    mainAirport: "Haneda Airport (HND)",
    currency: "Japanese Yen",
    area: 377975,
    flagEmoji: "🇯🇵"
  },
  {
    name: "India",
    capital: "New Delhi",
    continent: "Asia",
    subContinent: "Southern Asia",
    population: 1380000000,
    mainLanguage: "Hindi/English",
    mainAirport: "Indira Gandhi International Airport (DEL)",
    currency: "Indian Rupee",
    area: 3287263,
    flagEmoji: "🇮🇳"
  },
  {
    name: "South Korea",
    capital: "Seoul",
    continent: "Asia",
    subContinent: "Eastern Asia",
    population: 51800000,
    mainLanguage: "Korean",
    mainAirport: "Incheon International Airport (ICN)",
    currency: "South Korean Won",
    area: 100210,
    flagEmoji: "🇰🇷"
  },
  {
    name: "Thailand",
    capital: "Bangkok",
    continent: "Asia",
    subContinent: "South-Eastern Asia",
    population: 69800000,
    mainLanguage: "Thai",
    mainAirport: "Suvarnabhumi Airport (BKK)",
    currency: "Thai Baht",
    area: 513120,
    flagEmoji: "🇹🇭"
  },
  
  // Africa
  {
    name: "Nigeria",
    capital: "Abuja",
    continent: "Africa",
    subContinent: "Western Africa",
    population: 218500000,
    mainLanguage: "English",
    mainAirport: "Murtala Muhammed International Airport (LOS)",
    currency: "Nigerian Naira",
    area: 923768,
    flagEmoji: "🇳🇬"
  },
  {
    name: "South Africa",
    capital: "Cape Town",
    continent: "Africa",
    subContinent: "Southern Africa",
    population: 60400000,
    mainLanguage: "Afrikaans/English",
    mainAirport: "O.R. Tambo International Airport (JNB)",
    currency: "South African Rand",
    area: 1221037,
    flagEmoji: "🇿🇦"
  },
  {
    name: "Egypt",
    capital: "Cairo",
    continent: "Africa",
    subContinent: "Northern Africa",
    population: 104300000,
    mainLanguage: "Arabic",
    mainAirport: "Cairo International Airport (CAI)",
    currency: "Egyptian Pound",
    area: 1001449,
    flagEmoji: "🇪🇬"
  },
  {
    name: "Kenya",
    capital: "Nairobi",
    continent: "Africa",
    subContinent: "Eastern Africa",
    population: 54000000,
    mainLanguage: "Swahili/English",
    mainAirport: "Jomo Kenyatta International Airport (NBO)",
    currency: "Kenyan Shilling",
    area: 580367,
    flagEmoji: "🇰🇪"
  },
  
  // Oceania
  {
    name: "Australia",
    capital: "Canberra",
    continent: "Oceania",
    subContinent: "Australia and New Zealand",
    population: 25700000,
    mainLanguage: "English",
    mainAirport: "Sydney Kingsford Smith Airport (SYD)",
    currency: "Australian Dollar",
    area: 7692024,
    flagEmoji: "🇦🇺"
  },
  {
    name: "New Zealand",
    capital: "Wellington",
    continent: "Oceania",
    subContinent: "Australia and New Zealand",
    population: 5100000,
    mainLanguage: "English",
    mainAirport: "Auckland Airport (AKL)",
    currency: "New Zealand Dollar",
    area: 268838,
    flagEmoji: "🇳🇿"
  },
  
  // Additional European countries
  {
    name: "Russia",
    capital: "Moscow",
    continent: "Europe",
    subContinent: "Eastern Europe",
    population: 146200000,
    mainLanguage: "Russian",
    mainAirport: "Sheremetyevo International Airport (SVO)",
    currency: "Russian Ruble",
    area: 17098242,
    flagEmoji: "🇷🇺"
  },
  {
    name: "Netherlands",
    capital: "Amsterdam",
    continent: "Europe",
    subContinent: "Western Europe",
    population: 17400000,
    mainLanguage: "Dutch",
    mainAirport: "Amsterdam Airport Schiphol (AMS)",
    currency: "Euro",
    area: 41543,
    flagEmoji: "🇳🇱"
  },
  {
    name: "Sweden",
    capital: "Stockholm",
    continent: "Europe",
    subContinent: "Northern Europe",
    population: 10400000,
    mainLanguage: "Swedish",
    mainAirport: "Stockholm Arlanda Airport (ARN)",
    currency: "Swedish Krona",
    area: 450295,
    flagEmoji: "🇸🇪"
  },
  {
    name: "Norway",
    capital: "Oslo",
    continent: "Europe",
    subContinent: "Northern Europe",
    population: 5400000,
    mainLanguage: "Norwegian",
    mainAirport: "Oslo Airport (OSL)",
    currency: "Norwegian Krone",
    area: 323802,
    flagEmoji: "🇳🇴"
  },
  {
    name: "Poland",
    capital: "Warsaw",
    continent: "Europe",
    subContinent: "Eastern Europe",
    population: 38000000,
    mainLanguage: "Polish",
    mainAirport: "Warsaw Chopin Airport (WAW)",
    currency: "Polish Złoty",
    area: 312696,
    flagEmoji: "🇵🇱"
  },
  {
    name: "Portugal",
    capital: "Lisbon",
    continent: "Europe",
    subContinent: "Southern Europe",
    population: 10300000,
    mainLanguage: "Portuguese",
    mainAirport: "Lisbon Airport (LIS)",
    currency: "Euro",
    area: 92090,
    flagEmoji: "🇵🇹"
  },
  {
    name: "Greece",
    capital: "Athens",
    continent: "Europe",
    subContinent: "Southern Europe",
    population: 10700000,
    mainLanguage: "Greek",
    mainAirport: "Athens International Airport (ATH)",
    currency: "Euro",
    area: 131957,
    flagEmoji: "🇬🇷"
  },
  {
    name: "Czech Republic",
    capital: "Prague",
    continent: "Europe",
    subContinent: "Eastern Europe",
    population: 10700000,
    mainLanguage: "Czech",
    mainAirport: "Václav Havel Airport Prague (PRG)",
    currency: "Czech Koruna",
    area: 78867,
    flagEmoji: "🇨🇿"
  },
  {
    name: "Belgium",
    capital: "Brussels",
    continent: "Europe",
    subContinent: "Western Europe",
    population: 11500000,
    mainLanguage: "Dutch/French",
    mainAirport: "Brussels Airport (BRU)",
    currency: "Euro",
    area: 30528,
    flagEmoji: "🇧🇪"
  },
  {
    name: "Austria",
    capital: "Vienna",
    continent: "Europe",
    subContinent: "Western Europe",
    population: 9000000,
    mainLanguage: "German",
    mainAirport: "Vienna International Airport (VIE)",
    currency: "Euro",
    area: 83879,
    flagEmoji: "🇦🇹"
  },
  {
    name: "Switzerland",
    capital: "Bern",
    continent: "Europe",
    subContinent: "Western Europe",
    population: 8700000,
    mainLanguage: "German/French/Italian",
    mainAirport: "Zurich Airport (ZUR)",
    currency: "Swiss Franc",
    area: 41285,
    flagEmoji: "🇨🇭"
  },
  {
    name: "Denmark",
    capital: "Copenhagen",
    continent: "Europe",
    subContinent: "Northern Europe",
    population: 5800000,
    mainLanguage: "Danish",
    mainAirport: "Copenhagen Airport (CPH)",
    currency: "Danish Krone",
    area: 43094,
    flagEmoji: "🇩🇰"
  },
  {
    name: "Finland",
    capital: "Helsinki",
    continent: "Europe",
    subContinent: "Northern Europe",
    population: 5500000,
    mainLanguage: "Finnish",
    mainAirport: "Helsinki Airport (HEL)",
    currency: "Euro",
    area: 338424,
    flagEmoji: "🇫🇮"
  },
  {
    name: "Ireland",
    capital: "Dublin",
    continent: "Europe",
    subContinent: "Northern Europe",
    population: 5000000,
    mainLanguage: "English/Irish",
    mainAirport: "Dublin Airport (DUB)",
    currency: "Euro",
    area: 70273,
    flagEmoji: "🇮🇪"
  },
  
  // More Asian countries
  {
    name: "Indonesia",
    capital: "Jakarta",
    continent: "Asia",
    subContinent: "South-Eastern Asia",
    population: 273500000,
    mainLanguage: "Indonesian",
    mainAirport: "Soekarno-Hatta International Airport (CGK)",
    currency: "Indonesian Rupiah",
    area: 1904569,
    flagEmoji: "🇮🇩"
  },
  {
    name: "Pakistan",
    capital: "Islamabad",
    continent: "Asia",
    subContinent: "Southern Asia",
    population: 225200000,
    mainLanguage: "Urdu/English",
    mainAirport: "Jinnah International Airport (KHI)",
    currency: "Pakistani Rupee",
    area: 881913,
    flagEmoji: "🇵🇰"
  },
  {
    name: "Bangladesh",
    capital: "Dhaka",
    continent: "Asia",
    subContinent: "Southern Asia",
    population: 165000000,
    mainLanguage: "Bengali",
    mainAirport: "Hazrat Shahjalal International Airport (DAC)",
    currency: "Bangladeshi Taka",
    area: 147570,
    flagEmoji: "🇧🇩"
  },
  {
    name: "Vietnam",
    capital: "Hanoi",
    continent: "Asia",
    subContinent: "South-Eastern Asia",
    population: 97300000,
    mainLanguage: "Vietnamese",
    mainAirport: "Noi Bai International Airport (HAN)",
    currency: "Vietnamese Dong",
    area: 331212,
    flagEmoji: "🇻🇳"
  },
  {
    name: "Philippines",
    capital: "Manila",
    continent: "Asia",
    subContinent: "South-Eastern Asia",
    population: 109600000,
    mainLanguage: "Filipino/English",
    mainAirport: "Ninoy Aquino International Airport (MNL)",
    currency: "Philippine Peso",
    area: 300000,
    flagEmoji: "🇵🇭"
  },
  {
    name: "Turkey",
    capital: "Ankara",
    continent: "Asia",
    subContinent: "Western Asia",
    population: 84300000,
    mainLanguage: "Turkish",
    mainAirport: "Istanbul Airport (IST)",
    currency: "Turkish Lira",
    area: 783562,
    flagEmoji: "🇹🇷"
  },
  {
    name: "Iran",
    capital: "Tehran",
    continent: "Asia",
    subContinent: "Western Asia",
    population: 84000000,
    mainLanguage: "Persian",
    mainAirport: "Imam Khomeini International Airport (IKA)",
    currency: "Iranian Rial",
    area: 1648195,
    flagEmoji: "🇮🇷"
  },
  {
    name: "Iraq",
    capital: "Baghdad",
    continent: "Asia",
    subContinent: "Western Asia",
    population: 40200000,
    mainLanguage: "Arabic",
    mainAirport: "Baghdad International Airport (BGW)",
    currency: "Iraqi Dinar",
    area: 438317,
    flagEmoji: "🇮🇶"
  },
  {
    name: "Saudi Arabia",
    capital: "Riyadh",
    continent: "Asia",
    subContinent: "Western Asia",
    population: 35000000,
    mainLanguage: "Arabic",
    mainAirport: "King Khalid International Airport (RUH)",
    currency: "Saudi Riyal",
    area: 2149690,
    flagEmoji: "🇸🇦"
  },
  {
    name: "Israel",
    capital: "Jerusalem",
    continent: "Asia",
    subContinent: "Western Asia",
    population: 9400000,
    mainLanguage: "Hebrew/Arabic",
    mainAirport: "Ben Gurion Airport (TLV)",
    currency: "Israeli Shekel",
    area: 20770,
    flagEmoji: "🇮🇱"
  },
  {
    name: "Malaysia",
    capital: "Kuala Lumpur",
    continent: "Asia",
    subContinent: "South-Eastern Asia",
    population: 32700000,
    mainLanguage: "Malay",
    mainAirport: "Kuala Lumpur International Airport (KUL)",
    currency: "Malaysian Ringgit",
    area: 329847,
    flagEmoji: "🇲🇾"
  },
  {
    name: "Singapore",
    capital: "Singapore",
    continent: "Asia",
    subContinent: "South-Eastern Asia",
    population: 5900000,
    mainLanguage: "English/Malay/Chinese/Tamil",
    mainAirport: "Singapore Changi Airport (SIN)",
    currency: "Singapore Dollar",
    area: 719,
    flagEmoji: "🇸🇬"
  },
  
  // More African countries
  {
    name: "Morocco",
    capital: "Rabat",
    continent: "Africa",
    subContinent: "Northern Africa",
    population: 37500000,
    mainLanguage: "Arabic/Berber",
    mainAirport: "Mohammed V International Airport (CMN)",
    currency: "Moroccan Dirham",
    area: 446550,
    flagEmoji: "🇲🇦"
  },
  {
    name: "Algeria",
    capital: "Algiers",
    continent: "Africa",
    subContinent: "Northern Africa",
    population: 44700000,
    mainLanguage: "Arabic",
    mainAirport: "Houari Boumediene Airport (ALG)",
    currency: "Algerian Dinar",
    area: 2381741,
    flagEmoji: "🇩🇿"
  },
  {
    name: "Tunisia",
    capital: "Tunis",
    continent: "Africa",
    subContinent: "Northern Africa",
    population: 11800000,
    mainLanguage: "Arabic",
    mainAirport: "Tunis-Carthage International Airport (TUN)",
    currency: "Tunisian Dinar",
    area: 163610,
    flagEmoji: "🇹🇳"
  },
  {
    name: "Libya",
    capital: "Tripoli",
    continent: "Africa",
    subContinent: "Northern Africa",
    population: 6900000,
    mainLanguage: "Arabic",
    mainAirport: "Mitiga International Airport (MJI)",
    currency: "Libyan Dinar",
    area: 1759540,
    flagEmoji: "🇱🇾"
  },
  {
    name: "Ethiopia",
    capital: "Addis Ababa",
    continent: "Africa",
    subContinent: "Eastern Africa",
    population: 117900000,
    mainLanguage: "Amharic",
    mainAirport: "Addis Ababa Bole International Airport (ADD)",
    currency: "Ethiopian Birr",
    area: 1104300,
    flagEmoji: "🇪🇹"
  },
  {
    name: "Ghana",
    capital: "Accra",
    continent: "Africa",
    subContinent: "Western Africa",
    population: 32800000,
    mainLanguage: "English",
    mainAirport: "Kotoka International Airport (ACC)",
    currency: "Ghanaian Cedi",
    area: 238533,
    flagEmoji: "🇬🇭"
  },
  {
    name: "Tanzania",
    capital: "Dodoma",
    continent: "Africa",
    subContinent: "Eastern Africa",
    population: 61500000,
    mainLanguage: "Swahili/English",
    mainAirport: "Julius Nyerere International Airport (DAR)",
    currency: "Tanzanian Shilling",
    area: 947303,
    flagEmoji: "🇹🇿"
  },
  {
    name: "Uganda",
    capital: "Kampala",
    continent: "Africa",
    subContinent: "Eastern Africa",
    population: 47100000,
    mainLanguage: "English/Swahili",
    mainAirport: "Entebbe International Airport (EBB)",
    currency: "Ugandan Shilling",
    area: 241038,
    flagEmoji: "🇺🇬"
  },
  {
    name: "Zimbabwe",
    capital: "Harare",
    continent: "Africa",
    subContinent: "Southern Africa",
    population: 15100000,
    mainLanguage: "English/Shona",
    mainAirport: "Robert Gabriel Mugabe International Airport (HRE)",
    currency: "Zimbabwean Dollar",
    area: 390757,
    flagEmoji: "🇿🇼"
  },
  
  // More South American countries
  {
    name: "Colombia",
    capital: "Bogotá",
    continent: "South America",
    subContinent: "South America",
    population: 51000000,
    mainLanguage: "Spanish",
    mainAirport: "El Dorado International Airport (BOG)",
    currency: "Colombian Peso",
    area: 1141748,
    flagEmoji: "🇨🇴"
  },
  {
    name: "Peru",
    capital: "Lima",
    continent: "South America",
    subContinent: "South America",
    population: 33000000,
    mainLanguage: "Spanish",
    mainAirport: "Jorge Chávez International Airport (LIM)",
    currency: "Peruvian Sol",
    area: 1285216,
    flagEmoji: "🇵🇪"
  },
  {
    name: "Venezuela",
    capital: "Caracas",
    continent: "South America",
    subContinent: "South America",
    population: 28400000,
    mainLanguage: "Spanish",
    mainAirport: "Simón Bolívar International Airport (CCS)",
    currency: "Venezuelan Bolívar",
    area: 912050,
    flagEmoji: "🇻🇪"
  },
  {
    name: "Ecuador",
    capital: "Quito",
    continent: "South America",
    subContinent: "South America",
    population: 17600000,
    mainLanguage: "Spanish",
    mainAirport: "Mariscal Sucre International Airport (UIO)",
    currency: "US Dollar",
    area: 283561,
    flagEmoji: "🇪🇨"
  },
  {
    name: "Bolivia",
    capital: "La Paz",
    continent: "South America",
    subContinent: "South America",
    population: 11800000,
    mainLanguage: "Spanish/Quechua/Aymara",
    mainAirport: "El Alto International Airport (LPB)",
    currency: "Bolivian Boliviano",
    area: 1098581,
    flagEmoji: "🇧🇴"
  },
  {
    name: "Uruguay",
    capital: "Montevideo",
    continent: "South America",
    subContinent: "South America",
    population: 3500000,
    mainLanguage: "Spanish",
    mainAirport: "Montevideo Airport (MVD)",
    currency: "Uruguayan Peso",
    area: 176215,
    flagEmoji: "🇺🇾"
  },
  {
    name: "Paraguay",
    capital: "Asunción",
    continent: "South America",
    subContinent: "South America",
    population: 7100000,
    mainLanguage: "Spanish/Guaraní",
    mainAirport: "Silvio Pettirossi International Airport (ASU)",
    currency: "Paraguayan Guaraní",
    area: 406752,
    flagEmoji: "🇵🇾"
  },
  
  // More North American countries
  {
    name: "Guatemala",
    capital: "Guatemala City",
    continent: "North America",
    subContinent: "Central America",
    population: 17900000,
    mainLanguage: "Spanish",
    mainAirport: "La Aurora International Airport (GUA)",
    currency: "Guatemalan Quetzal",
    area: 108889,
    flagEmoji: "🇬🇹"
  },
  {
    name: "Cuba",
    capital: "Havana",
    continent: "North America",
    subContinent: "Caribbean",
    population: 11300000,
    mainLanguage: "Spanish",
    mainAirport: "José Martí International Airport (HAV)",
    currency: "Cuban Peso",
    area: 109884,
    flagEmoji: "🇨🇺"
  },
  {
    name: "Jamaica",
    capital: "Kingston",
    continent: "North America",
    subContinent: "Caribbean",
    population: 2900000,
    mainLanguage: "English",
    mainAirport: "Norman Manley International Airport (KIN)",
    currency: "Jamaican Dollar",
    area: 10991,
    flagEmoji: "🇯🇲"
  },
  {
    name: "Costa Rica",
    capital: "San José",
    continent: "North America",
    subContinent: "Central America",
    population: 5100000,
    mainLanguage: "Spanish",
    mainAirport: "Juan Santamaría International Airport (SJO)",
    currency: "Costa Rican Colón",
    area: 51100,
    flagEmoji: "🇨🇷"
  },
  {
    name: "Panama",
    capital: "Panama City",
    continent: "North America",
    subContinent: "Central America",
    population: 4300000,
    mainLanguage: "Spanish",
    mainAirport: "Tocumen International Airport (PTY)",
    currency: "Panamanian Balboa",
    area: 75417,
    flagEmoji: "🇵🇦"
  }
];

// Helper functions for data access
export const getCountryByName = (name: string): Country | undefined => {
  return countries.find(country => 
    country.name.toLowerCase() === name.toLowerCase()
  );
};

export const getCountriesByContinent = (continent: string): Country[] => {
  return countries.filter(country => 
    country.continent.toLowerCase() === continent.toLowerCase()
  );
};

export const getRandomCountry = (): Country => {
  const randomIndex = Math.floor(Math.random() * countries.length);
  return countries[randomIndex];
};

export const getRandomCountries = (count: number): Country[] => {
  const shuffled = [...countries].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};