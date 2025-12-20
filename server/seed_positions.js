
const supabase = require('./config/supabaseClient');

const positions = [
    { name: 'Goalkeeper', category: 'Goalkeeper' }, { name: 'GK', category: 'Goalkeeper' },
    { name: 'Defender', category: 'Defender' }, { name: 'CB', category: 'Defender' }, { name: 'LB', category: 'Defender' }, { name: 'RB', category: 'Defender' }, { name: 'LWB', category: 'Defender' }, { name: 'RWB', category: 'Defender' },
    { name: 'Midfielder', category: 'Midfielder' }, { name: 'CDM', category: 'Midfielder' }, { name: 'CM', category: 'Midfielder' }, { name: 'CAM', category: 'Midfielder' }, { name: 'LM', category: 'Midfielder' }, { name: 'RM', category: 'Midfielder' },
    { name: 'Forward', category: 'Forward' }, { name: 'LW', category: 'Forward' }, { name: 'RW', category: 'Forward' }, { name: 'CF', category: 'Forward' }, { name: 'ST', category: 'Forward' }
];

const seedPositions = async () => {
    console.log('Seeding positions...');

    // First, check existing to avoid duplicates if unique constraint exists, 
    // or just use upsert if we had IDs. Since we don't know IDs, we'll check by name.
    const { data: existing } = await supabase.from('positions').select('position_name');
    const existingNames = new Set(existing?.map(p => p.position_name) || []);

    const toInsert = positions
        .filter(p => !existingNames.has(p.name))
        .map(p => ({ position_name: p.name, position_category: p.category }));

    if (toInsert.length === 0) {
        console.log('No new positions to insert.');
        return;
    }

    const { error } = await supabase.from('positions').insert(toInsert);

    if (error) {
        console.error('Error seeding positions:', error);
    } else {
        console.log(`Successfully added ${toInsert.length} positions.`);
    }
};

seedPositions();
