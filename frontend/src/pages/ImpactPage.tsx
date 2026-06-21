import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

function ImpactWave() {
  return (
    <svg viewBox="0 0 400 40" preserveAspectRatio="none"
         style={{ display: 'block', width: '100%', height: 40, marginTop: -1 }}>
      <path d="M0,0 L400,0 L400,40 Q330,8 260,26 Q190,44 120,18 Q60,-4 0,20 Z"
            fill="#1b4332"/>
    </svg>
  )
}

const DAILY_MESSAGES = [
  // ── Climate (1–40) ──
  { headline: 'Climate justice starts with daily choices.', body: 'Climate change hits hardest those who did least to cause it. Every action helps close that gap.' },
  { headline: 'The warmest years on record are the last ten.', body: 'This is not a trend. It is a trajectory — and daily choices bend it.' },
  { headline: '1.5°C is not just a number.', body: 'It is a threshold separating manageable change from cascading, irreversible harm.' },
  { headline: 'Carbon is invisible. Its impacts are not.', body: 'Floods, droughts, displacement — every emission has a consequence, even if delayed.' },
  { headline: 'Climate grief is real. So is climate action.', body: 'Both can coexist. Let the grief inform the action, not replace it.' },
  { headline: 'The climate crisis is also a health crisis.', body: 'Air pollution, extreme heat, and food insecurity are already killing millions annually.' },
  { headline: 'Extreme weather is a human-made disaster.', body: 'Attribution science now links individual events to emissions. We know the cause.' },
  { headline: 'Every fraction of a degree matters.', body: 'The difference between 1.5°C and 2°C is hundreds of millions of lives and livelihoods.' },
  { headline: 'Tipping points are real — and avoidable.', body: 'Keeping systems stable requires action now, while we still have the margin.' },
  { headline: 'The atmosphere has no borders.', body: 'What any nation emits, every nation bears. Climate is the ultimate shared commons.' },
  { headline: 'Fossil fuels receive $7 trillion in subsidies annually.', body: 'That money could fund the entire clean energy transition multiple times over.' },
  { headline: 'Green jobs are the fastest-growing sector.', body: 'The energy transition is not a cost — it is the largest economic opportunity in a century.' },
  { headline: 'Cities produce 70% of global CO₂ emissions.', body: 'They are also where the most powerful solutions are being tested and deployed.' },
  { headline: 'Buildings account for 40% of global energy use.', body: 'Insulation, passive design, and electrification are the fastest routes to change.' },
  { headline: 'The Arctic is warming four times faster than average.', body: 'What happens there does not stay there — it reshapes weather patterns globally.' },
  { headline: 'Permafrost thaw releases ancient carbon.', body: 'Every degree of warming risks unleashing emissions stored for millennia. Urgency is rational.' },
  { headline: 'Climate change amplifies every existing inequality.', body: 'Poverty, gender disparity, and race all determine who suffers most. Justice and climate are one issue.' },
  { headline: '3.3 billion people live in climate-vulnerable areas.', body: 'Most of them contributed least to the problem. Equity is not optional — it is the point.' },
  { headline: 'Coastal communities are already relocating.', body: 'Sea-level rise is not a future scenario. It is a present reality for millions.' },
  { headline: 'Wildfire seasons are growing longer every decade.', body: 'What was once a seasonal event is becoming a permanent condition in some regions.' },
  { headline: 'Heat islands hit low-income neighbourhoods hardest.', body: 'Urban greening, white roofs, and shading are acts of both ecology and justice.' },
  { headline: 'Climate resilience starts in the soil.', body: 'Healthy soil absorbs water, sequesters carbon, and keeps food systems stable.' },
  { headline: 'Air pollution kills 7 million people annually.', body: 'Most of those deaths are preventable with cleaner energy and transport systems.' },
  { headline: 'Every tonne of CO₂ avoided is compound interest.', body: 'Emissions saved today prevent amplified warming in the decades ahead.' },
  { headline: 'The world has the solutions.', body: 'Solar, wind, efficiency, and behaviour change can do the job. What is needed is will.' },
  { headline: 'Climate finance must triple to meet global goals.', body: 'The gap between pledges and delivery is where the crisis lives.' },
  { headline: 'Young people are leading the climate movement.', body: 'They are striking, litigating, and organising — because the timeline is theirs.' },
  { headline: 'Indigenous communities protect 80% of biodiversity.', body: 'Their land rights and knowledge systems are climate solutions — not footnotes.' },
  { headline: 'The ocean absorbs 90% of excess climate heat.', body: 'It is protecting us — at an enormous cost to its own ecology.' },
  { headline: 'Climate anxiety is a rational response.', body: 'Channelled into action and community, it becomes one of the most productive forces available.' },
  { headline: 'Reforestation helps, but is not enough alone.', body: 'Emissions must fall sharply. Trees buy time — they cannot replace structural change.' },
  { headline: 'A climate-stable world is a more peaceful world.', body: 'Resource scarcity and displacement are among the leading drivers of conflict.' },
  { headline: 'The energy transition is the great economic opportunity.', body: 'It creates more jobs, improves health, and reduces geopolitical risk simultaneously.' },
  { headline: 'Mitigation and adaptation must happen at once.', body: 'Cutting emissions is not enough if we do not also protect communities already at risk.' },
  { headline: 'Net zero by 2050 requires action this decade.', body: 'The carbon budget does not wait. Early action costs far less than delayed action.' },
  { headline: 'Degrowth and wellbeing can go together.', body: 'Evidence from shorter working weeks, universal services, and lower-consumption societies says so.' },
  { headline: 'Heat stress now limits outdoor work in many regions.', body: 'Workers in construction, agriculture, and transport bear this risk daily.' },
  { headline: 'Carbon removal at scale is still theoretical.', body: 'We cannot bank on technology that does not yet exist. Emission cuts are the priority.' },
  { headline: 'Climate inaction has a price tag.', body: 'The economic cost of unmitigated climate change dwarfs the cost of acting now.' },
  { headline: 'You are part of the climate solution.', body: 'Not the whole solution — but a real and meaningful part of it. That counts.' },
  // ── Water (41–70) ──
  { headline: 'Water is not infinite.', body: 'Treat every litre as though it matters — because it does, to someone somewhere.' },
  { headline: '2 billion people lack access to safe drinking water.', body: 'Water security is the most basic form of human security. Act like it.' },
  { headline: 'By 2050, half the world may face water scarcity.', body: 'Conservation now is not a sacrifice — it is preparation for the world we are building.' },
  { headline: 'Groundwater is depleted faster than it refills.', body: 'Aquifers that took millennia to fill are being emptied in decades. The math does not work.' },
  { headline: 'Wetlands filter water, store carbon, and prevent floods.', body: 'They are the most cost-effective water infrastructure on the planet.' },
  { headline: '80% of wastewater is released untreated globally.', body: 'Clean water begins with how we treat the water we have already used.' },
  { headline: 'A cotton t-shirt takes 2,700 litres to produce.', body: 'Virtual water is embedded in everything we buy. Consuming less conserves water invisibly.' },
  { headline: 'Water stress is already driving conflict.', body: 'Resource scarcity and climate change are inseparable from geopolitical instability.' },
  { headline: 'Water is a human right — not a commodity.', body: 'When access depends on ability to pay, the most vulnerable always lose first.' },
  { headline: 'Rivers that reach the sea are becoming rare.', body: 'Over-extraction upstream is one of the most visible signs of a system in crisis.' },
  { headline: 'Rainwater harvesting is ancient and effective.', body: 'One of our oldest technologies is one of our most relevant solutions right now.' },
  { headline: 'Drip irrigation uses 50% less water than flooding.', body: 'Agricultural efficiency is the fastest route to closing the global water gap.' },
  { headline: '1 in 3 schools globally lacks clean water and sanitation.', body: 'Water access shapes who can learn, who can work, and who can participate.' },
  { headline: 'Glaciers provide freshwater to a billion people.', body: 'They are retreating. The communities downstream are already planning for what comes next.' },
  { headline: 'Every drop saved today is stored credit for tomorrow.', body: 'Conservation does not feel like action. But it is one of the most powerful kinds.' },
  { headline: 'Restoring floodplains is cheaper than flood defences.', body: 'Nature-based solutions outperform engineered ones in cost, longevity, and co-benefits.' },
  { headline: 'Plastic pollution affects 700 aquatic species.', body: 'Clean water and clean oceans require the same upstream solution: less plastic produced.' },
  { headline: 'Water-borne disease kills more children than any war.', body: 'Sanitation investment is one of the highest-return health and equity interventions available.' },
  { headline: 'The Colorado River no longer reaches the sea most years.', body: 'Over-allocation is not a future risk. It is a present reality in major river systems worldwide.' },
  { headline: 'Urban stormwater can be harvested rather than lost.', body: 'Green infrastructure in cities captures water, reduces flooding, and cools urban heat.' },
  { headline: 'Clean rivers begin with what we pour down the drain.', body: 'Every household is upstream of something. Act accordingly.' },
  { headline: 'Access to sanitation is a gender issue.', body: 'Girls miss school and women face safety risks when sanitation is absent or inadequate.' },
  { headline: 'Aquifer depletion in South Asia threatens billions.', body: 'Food security for much of humanity rests on groundwater that is quietly disappearing.' },
  { headline: 'Blue-green infrastructure replaces pipes with nature.', body: 'Rain gardens, green roofs, and permeable surfaces manage water while creating habitat.' },
  { headline: 'Water stewardship is financial stewardship.', body: 'Companies that ignore water risk face stranded assets, supply chain failure, and liability.' },
  { headline: 'The water cycle connects every ecosystem on earth.', body: 'Forest loss disrupts rainfall patterns thousands of miles away. Nothing is isolated.' },
  { headline: 'Drinking water quality remains unequal in wealthy nations.', body: 'Infrastructure neglect in low-income areas is a political choice, not an inevitability.' },
  { headline: 'Desalination is energy-intensive — conservation comes first.', body: 'The cheapest litre of water is always the one not wasted.' },
  { headline: 'Seagrass meadows are the ocean\'s freshwater guardians.', body: 'They filter coastal water, stabilise sediment, and support fisheries that millions depend on.' },
  { headline: 'Water-efficient agriculture could feed the world.', body: 'The food system uses 70% of all freshwater. Improving that use changes everything.' },
  // ── Biodiversity (71–100) ──
  { headline: 'One million species face extinction.', body: 'Most have not yet been named. We are losing what we have barely begun to understand.' },
  { headline: 'Biodiversity is the immune system of the planet.', body: 'Diverse ecosystems resist disease, recover from shock, and provide stability for everything else.' },
  { headline: '75% of food crops depend on pollinators.', body: 'Protecting insects is not abstract environmentalism. It is food security.' },
  { headline: 'Soil holds more species than any rainforest canopy.', body: 'A teaspoon of healthy soil contains more organisms than there are people on earth.' },
  { headline: 'Mangroves protect coasts, store carbon, and nurse fisheries.', body: 'Restoring them delivers more value per hectare than almost any other intervention.' },
  { headline: '70% of global deforestation is driven by agriculture.', body: 'What we eat is the most direct link between human choices and forest loss.' },
  { headline: 'Rewilding produces cascading positive effects.', body: 'Reintroducing one species can change river courses, restore plant communities, and recover soils.' },
  { headline: 'The ocean produces half the oxygen we breathe.', body: 'Marine biodiversity is not a conservation issue. It is a survival issue.' },
  { headline: 'Invasive species cost $1.4 trillion annually.', body: 'Prevention — through biosecurity, native planting, and trade controls — is far cheaper than cure.' },
  { headline: 'Coral reefs support a quarter of all marine species.', body: 'At 1.5°C of warming, 70–90% of corals are at risk. At 2°C, nearly all of them.' },
  { headline: 'Urban gardens are corridors for pollinators.', body: 'Every garden, balcony, and verge planted with natives is a piece of connected habitat.' },
  { headline: 'Native plants support 10x more wildlife than ornamentals.', body: 'They have co-evolved with local insects and birds over thousands of years.' },
  { headline: 'The Amazon creates its own rainfall.', body: 'Deforestation is not just losing trees — it is losing the water cycle that sustains a continent.' },
  { headline: 'Old-growth forests store far more carbon than plantations.', body: 'Age, complexity, and diversity are not replaceable by rows of identical trees.' },
  { headline: 'Fish populations have halved since 1970.', body: 'Sustainable fisheries management exists. The political will to enforce it is the missing ingredient.' },
  { headline: 'Peatlands store twice the carbon of all forests combined.', body: 'They cover just 3% of land. Protecting them is one of the most leveraged climate acts.' },
  { headline: 'Seed banks are the vaults of our food future.', body: 'Crop diversity is our insurance against disease, drought, and climate disruption.' },
  { headline: 'The sixth mass extinction is the first caused by one species.', body: 'That makes us unique in geological history — and uniquely responsible.' },
  { headline: 'Ecosystem services are worth $150 trillion per year.', body: 'Clean air, water, pollination, and climate regulation are produced by nature — free of charge.' },
  { headline: 'Nature-based solutions can deliver a third of climate mitigation.', body: 'Protecting and restoring ecosystems is both a climate strategy and a biodiversity strategy.' },
  { headline: 'Fungi connect forests — the original internet.', body: 'Mycorrhizal networks share nutrients between trees. Damaging soil severs these connections.' },
  { headline: 'Protecting 30% of land and ocean by 2030 is achievable.', body: 'Targets set in Montreal in 2022. Progress depends on finance, governance, and political commitment.' },
  { headline: 'Bats pollinate mangoes, bananas, and 500 other species.', body: 'Every species lost from the web of life weakens what remains.' },
  { headline: 'Seagrass sequesters carbon 35x faster than tropical forests.', body: 'Marine ecosystems are among the most powerful carbon sinks we have — and the most neglected.' },
  { headline: 'Every species lost takes irreplaceable knowledge with it.', body: 'Evolutionary solutions to problems we have not yet encountered disappear with each extinction.' },
  { headline: 'A healthy gut microbiome needs contact with diverse nature.', body: 'Human health and ecological health are connected at the most fundamental biological level.' },
  { headline: 'Deforestation emits more CO₂ than all global transport.', body: 'Standing forests are the most cost-effective carbon capture technology ever devised.' },
  { headline: 'Silent Spring was published in 1962.', body: 'Pesticide use has increased since then. The warning was right. The response has been insufficient.' },
  { headline: 'Every garden is a potential nature reserve.', body: 'At scale, domestic gardens are a significant and largely untapped conservation resource.' },
  { headline: 'We are nature. What we do to it, we do to ourselves.', body: 'The boundary between human and ecological wellbeing is not a line. It never was.' },
  // ── Food (30: 101–130) ──
  { headline: 'A plant-rich diet is the highest-impact dietary choice.', body: 'No other single food decision reduces emissions, land use, and water consumption as much.' },
  { headline: 'Livestock uses 80% of farmland for 20% of calories.', body: 'Rethinking what we eat is the fastest route to freeing land for nature and carbon.' },
  { headline: 'Food waste is the third-largest emitter — if it were a country.', body: 'Wasting food wastes every resource used to grow, transport, and refrigerate it.' },
  { headline: 'Seasonal and local food loses fewer nutrients in transit.', body: 'It also costs less, supports local farmers, and travels a fraction of the distance.' },
  { headline: 'Regenerative agriculture rebuilds soil and sequesters carbon.', body: 'It is not just a farming method — it is a climate intervention at landscape scale.' },
  { headline: '820 million people go hungry — while 30% of food is wasted.', body: 'This is not a production failure. It is a distribution and waste failure.' },
  { headline: 'Agroforestry integrates trees and crops to restore land.', body: 'It increases yield, improves biodiversity, and sequesters carbon — simultaneously.' },
  { headline: 'Crop diversity has collapsed by 75% in a century.', body: 'The narrowing of our food base is a fragility. Diverse diets support diverse farms.' },
  { headline: 'Overfishing threatens the protein source of 3 billion people.', body: 'Sustainable catch limits are science-based. Enforcing them is a political choice.' },
  { headline: 'Composting diverts food waste and creates free fertiliser.', body: 'What leaves the kitchen as waste can return to the garden as soil health.' },
  { headline: 'Community-supported agriculture shortens supply chains.', body: 'Direct relationships between growers and eaters build food security and trust.' },
  { headline: 'Ultra-processed food accounts for 60% of calories in some nations.', body: 'Its production is high-impact. Its health effects are well documented. The alternative is cooking.' },
  { headline: 'Food sovereignty is the right to define your own food system.', body: 'Communities and nations that control their food supply are more resilient to shocks.' },
  { headline: 'The average meal travels 1,500 miles before you eat it.', body: 'Every shorter food mile is a smaller carbon footprint and a more resilient supply chain.' },
  { headline: 'Ancient grains like teff and quinoa are low-impact and nutritious.', body: 'Dietary diversity is both a health strategy and a farming resilience strategy.' },
  { headline: 'Reducing red meat is one of the fastest personal emissions cuts.', body: 'You do not need to be perfect. Eating less, less often, already makes a difference.' },
  { headline: 'Kitchen gardens reconnect people with where food comes from.', body: 'Growing anything — even herbs on a windowsill — changes how you relate to food.' },
  { headline: 'Packaging accounts for nearly a third of all plastic waste.', body: 'The most effective packaging is no packaging. Second best is infinitely recyclable packaging.' },
  { headline: 'Open-pollinated seeds support farmer independence.', body: 'Patented seeds create dependency. Seed sovereignty is food sovereignty.' },
  { headline: 'Eating lower on the food chain is lighter on the planet.', body: 'The further a food is from a plant, the more energy was used to produce it.' },
  { headline: 'Fermented foods extend shelf life and reduce waste.', body: 'An ancient technology still reducing food loss — and improving gut health — worldwide.' },
  { headline: 'Urban farming is scaling in every major city.', body: 'Rooftop gardens, vertical farms, and community plots are changing urban food geography.' },
  { headline: 'Fair trade ensures farmers receive equitable payment.', body: 'The price of cheap coffee and chocolate is paid by the people who grow it.' },
  { headline: 'Food culture is inseparable from ecological culture.', body: 'How a community grows and shares food reflects its relationship with the land.' },
  { headline: 'Cooking at home produces less waste than ordering out.', body: 'Less packaging, less food loss, more connection to what you actually eat.' },
  { headline: 'Soil health is food security.', body: 'Degraded soils cannot support the crops the world needs. Regeneration is not optional.' },
  { headline: 'The best diet for the planet is also good for your body.', body: 'More plants, less ultra-processing, less waste — the evidence is consistent.' },
  { headline: 'Aquaculture done well reduces pressure on wild fisheries.', body: 'The distinction is in the method. Sustainable aquaculture is a genuine solution.' },
  { headline: 'Food banks treat a symptom — food equity addresses the cause.', body: 'Hunger in wealthy nations is a policy failure, not an inevitability.' },
  { headline: 'What we grow shapes the landscape for everyone.', body: 'Agricultural choices are land use choices. Land use choices are ecological choices.' },
  // ── Energy (30: 131–160) ──
  { headline: 'Solar is now the cheapest electricity in history.', body: 'The cost has fallen 90% in a decade. The transition is not coming — it is happening.' },
  { headline: 'Energy efficiency is cheaper than any new power source.', body: 'The cheapest unit of energy is always the one you do not use.' },
  { headline: 'Heat pumps are 3x more efficient than gas boilers.', body: 'They work in cold climates and their performance improves as the grid gets cleaner.' },
  { headline: 'Energy poverty affects 800 million people globally.', body: 'Access to clean, reliable energy is the foundation of education, health, and economic participation.' },
  { headline: 'Standby power uses 10% of household electricity.', body: 'Switching off at the wall is the lowest-effort, most underused energy intervention.' },
  { headline: 'The sun delivers more energy in an hour than we use in a year.', body: 'The resource is not the constraint. Distribution, storage, and policy are.' },
  { headline: 'Battery storage costs are falling faster than any technology in history.', body: 'The variable renewable energy challenge is becoming a storage-and-grid management challenge.' },
  { headline: 'Insulation is the most cost-effective energy intervention.', body: 'Warm, draught-free homes reduce bills, improve health, and cut emissions simultaneously.' },
  { headline: 'Community energy projects create local ownership over power.', body: 'When communities own their generation, the benefits stay local.' },
  { headline: 'LED lighting uses 90% less energy than incandescent bulbs.', body: 'A complete shift to LEDs globally would save the equivalent of 670 coal plants.' },
  { headline: 'Passive solar building design can eliminate heating needs.', body: 'Orientation, thermal mass, and insulation replace fuel. Architecture as energy policy.' },
  { headline: 'Tidal and wave energy are underused but vast in potential.', body: 'Predictable, consistent, and available at scale along coastlines worldwide.' },
  { headline: 'Energy co-operatives are among the fastest-growing civic enterprises.', body: 'Citizens owning their energy infrastructure is both a climate and a democracy story.' },
  { headline: 'Time-of-use tariffs reward shifting demand off-peak.', body: 'Using energy when supply is abundant reduces system costs for everyone.' },
  { headline: 'Buildings can generate as much energy as they consume.', body: 'Net-zero buildings exist today. They are not experimental — they are scalable.' },
  { headline: 'Demand reduction is always the first and cheapest step.', body: 'Before installing renewables, reduce the load they need to meet.' },
  { headline: 'Electrification of transport, heating, and industry is the priority.', body: 'A clean grid powers everything. Fossil fuels in each sector must be replaced.' },
  { headline: 'Energy access and energy justice must be designed together.', body: 'A transition that leaves the poorest behind is not a just transition — it is just transition.' },
  { headline: 'Geothermal provides constant baseload power without emissions.', body: 'Underused in most of the world, it holds significant untapped potential.' },
  { headline: 'The clean energy transition creates 3 jobs per fossil fuel job lost.', body: 'With planning and investment, no worker needs to be left behind.' },
  { headline: 'Decentralised energy gives communities resilience.', body: 'Distributed generation means no single failure point and more democratic ownership.' },
  { headline: 'Green hydrogen can decarbonise industries electricity cannot reach.', body: 'Steel, shipping, and aviation need alternatives. Green hydrogen is a leading candidate.' },
  { headline: 'Smart grids balance supply and demand in real time.', body: 'The intelligence of the grid is what makes high penetrations of renewables feasible.' },
  { headline: 'Nuclear produces minimal emissions over its lifecycle.', body: 'It remains part of many credible net-zero scenarios. The debate is about cost and time.' },
  { headline: 'Every new fossil fuel project delays the transition.', body: 'Infrastructure built today locks in emissions for 20–40 years. The timing matters.' },
  { headline: 'Cooking with clean fuels protects indoor air quality.', body: 'Household air pollution from solid fuels kills 4 million people a year — mostly women and children.' },
  { headline: 'Each unit of energy saved avoids the need to generate it.', body: 'Efficiency is a form of production. Less demand means less infrastructure needed.' },
  { headline: 'The energy transition is the largest infrastructure project in history.', body: 'It is also the most distributed — happening in homes, communities, and cities worldwide.' },
  { headline: 'Offshore wind generates power without competing for land.', body: 'Coastal nations have enormous capacity that is still barely tapped.' },
  { headline: 'Energy storage transforms a variable resource into a reliable one.', body: 'Sun and wind become baseload when paired with storage and smart grids.' },
  // ── Transport (25: 161–185) ──
  { headline: 'Transport accounts for 24% of global CO₂ emissions.', body: 'It is one of the hardest sectors to decarbonise — and one of the most important.' },
  { headline: 'Walking and cycling are the only truly zero-emission modes.', body: 'They also improve health, reduce congestion, and cost nothing to operate at scale.' },
  { headline: 'A full bus removes 40 cars from the road.', body: 'Public transport is a climate intervention, a congestion solution, and an equity strategy.' },
  { headline: 'EVs produce 70% less lifecycle emissions than petrol cars.', body: 'And the figure keeps improving as electricity grids get cleaner.' },
  { headline: 'Aviation is the fastest-growing transport emissions source.', body: 'Flying less — especially long-haul and frequent short-haul — is high-leverage action.' },
  { headline: 'High-speed rail uses 90% less energy than flying the same route.', body: 'Europe\'s night train revival shows the alternative already exists and is growing.' },
  { headline: '15-minute cities reduce car dependency by design.', body: 'When daily needs are within walking or cycling distance, car use falls naturally.' },
  { headline: 'Car-free streets increase footfall and wellbeing.', body: 'Every major city that has tried it has found retail improves and communities strengthen.' },
  { headline: 'Cycling infrastructure pays back through healthcare savings.', body: 'The return on investment in cycling is among the highest of any transport intervention.' },
  { headline: 'Freight accounts for 40% of transport emissions.', body: 'It is often invisible — but decarbonising logistics is essential to any climate strategy.' },
  { headline: 'Shared mobility reduces vehicles needed by a factor of 10.', body: 'Access without ownership — car clubs, e-bikes, and ride-sharing — changes the maths entirely.' },
  { headline: 'Accessible public transport enables economic participation.', body: 'For those without cars, the quality of public transport determines the quality of opportunity.' },
  { headline: 'E-bikes are the fastest-selling transport product in Europe.', body: 'They are extending the range and appeal of cycling beyond what human legs could manage.' },
  { headline: 'Shipping carries 90% of world trade.', body: 'Zero-emission fuels for shipping are becoming viable. Policy is the remaining constraint.' },
  { headline: 'Children who walk to school are healthier and perform better.', body: 'Safe routes to school are a public health, equity, and sustainability intervention combined.' },
  { headline: 'Road pricing shifts the cost to those who drive most.', body: 'It is among the most economically efficient transport demand management tools available.' },
  { headline: 'Teleworking can cut commuting emissions by half.', body: 'When designed well — fewer days in, not longer days home — it works for workers and the climate.' },
  { headline: 'Pavement given to parking can become parks and markets.', body: 'Cities that have reclaimed car space consistently report improved wellbeing and economic activity.' },
  { headline: 'Lower speed limits reduce emissions, noise, and fatalities.', body: 'A 20mph zone is a climate policy as much as a safety policy.' },
  { headline: 'Transport inequality leaves rural and low-income communities behind.', body: 'Designing inclusive transport systems is a justice imperative, not an afterthought.' },
  { headline: 'Cargo bikes can replace last-mile vans in dense areas.', body: 'Multiple cities have demonstrated this is commercially viable and faster in congestion.' },
  { headline: 'Urban sprawl is a transport problem as much as a land use one.', body: 'Compact, mixed-use development is the antidote to car dependency.' },
  { headline: 'Mobility as a service replaces ownership with access.', body: 'One platform, all modes — reducing the need to own private vehicles entirely.' },
  { headline: 'Autonomous vehicles will increase or decrease emissions.', body: 'Which outcome depends entirely on policy, mode, and whether they are shared.' },
  { headline: 'The most sustainable journey is one not made by car.', body: 'Not because cars are evil — but because every trip has options worth considering.' },
  // ── Waste & Circular Economy (30: 186–215) ──
  { headline: 'The circular economy could unlock $4.5 trillion in value.', body: 'Waste is a design failure. Good design produces no waste — and more value.' },
  { headline: 'Only 9% of plastic ever produced has been recycled.', body: 'Recycling is not the solution. Producing less plastic is the solution.' },
  { headline: 'The average person generates 4.4 lbs of waste per day.', body: 'That figure is not fixed. Communities and cultures that consume differently prove it.' },
  { headline: 'Electronics are the fastest-growing waste stream in the world.', body: 'Right to repair, modular design, and take-back schemes are the tools to address it.' },
  { headline: 'Repair cafés are returning to high streets everywhere.', body: 'Skills for fixing things were once universal. They are being reclaimed.' },
  { headline: 'The right to repair is a sustainability and consumer right.', body: 'When products are designed to be fixed, they last longer and waste less.' },
  { headline: 'Fashion is the second most polluting industry.', body: 'Buying less, buying better, and keeping clothes longer is the most direct response.' },
  { headline: 'A garment worn 30 times instead of 3 cuts its footprint by 90%.', body: 'Longevity is the highest sustainability metric in clothing.' },
  { headline: 'Landfill emits methane — 80x more potent than CO₂ at 20 years.', body: 'What goes to landfill does not disappear. It becomes a long-term emission source.' },
  { headline: 'Composting food waste produces free, carbon-storing fertiliser.', body: 'It also diverts material from landfill and closes the nutrient cycle.' },
  { headline: 'Single-use plastic bans measurably reduce ocean contamination.', body: 'Policy works. The evidence from bans in dozens of countries is consistent.' },
  { headline: 'Industrial symbiosis: one company\'s waste is another\'s raw material.', body: 'The original circular economy existed in ecosystems for billions of years. We are relearning it.' },
  { headline: 'Extended producer responsibility changes design incentives.', body: 'When companies pay for end-of-life, they design products to last and be recovered.' },
  { headline: 'The sharing economy reduces the products that need to be made.', body: 'Access over ownership is both a financial and an environmental strategy.' },
  { headline: 'Second-hand clothing markets grow 3x faster than new clothing.', body: 'Resale, rental, and swapping are becoming mainstream — not niche.' },
  { headline: 'Glass and aluminium can be recycled infinitely.', body: 'With no degradation in quality. These are the materials worth designing for recovery.' },
  { headline: 'The throwaway culture is a post-war invention.', body: 'It was deliberately engineered by industry. It can be deliberately unengineered.' },
  { headline: 'Zero-waste stores are proving packaging-free is commercially viable.', body: 'Consumer demand exists. What has been missing is the supply infrastructure.' },
  { headline: 'Library of Things lets communities share tools and equipment.', body: 'Most tools are used a handful of times. Sharing them is both efficient and connective.' },
  { headline: 'Ocean plastic cleanup cannot solve the plastic crisis alone.', body: 'Reduction at source is the only strategy that addresses the root cause.' },
  { headline: 'Textile waste releases toxic chemicals into groundwater.', body: 'What we wear does not disappear when we discard it — it enters the water cycle.' },
  { headline: 'A phone repaired is a phone not mined from new materials.', body: 'Every repair is a small act of resource conservation and supply chain improvement.' },
  { headline: 'Product-as-a-service incentivises durability over disposal.', body: 'When companies retain ownership, they have every reason to make things last.' },
  { headline: 'Every item bought second-hand avoids a new manufacture.', body: 'The carbon, water, and material cost of making something new is avoided entirely.' },
  { headline: 'Municipal composting is among the highest-return sustainability investments.', body: 'It diverts waste, produces soil amendment, and reduces landfill methane at scale.' },
  { headline: 'Paper recycling uses 60% less energy than virgin production.', body: 'And saves 17 trees per tonne. The case for recycling fibre is straightforward.' },
  { headline: 'Biochar from organic waste sequesters carbon and improves soil.', body: 'A waste stream becomes a carbon sink. Circular thinking at its most elegant.' },
  { headline: 'What we call waste, nature calls food.', body: 'In ecosystems, every output is an input for something else. That is the model.' },
  { headline: 'Reusable packaging systems are returning in new forms.', body: 'Deposit schemes, refillable containers, and milkman models scaled for modern retail.' },
  { headline: 'Waste reduction is wealth creation — for households and economies.', body: 'Every resource not wasted is a resource retained. The economics are clear.' },
  // ── Social Equity & Inequality (30: 216–245) ──
  { headline: 'Climate change deepens every existing inequality.', body: 'It is not a great equaliser. It is an amplifier of the divides already present.' },
  { headline: 'Women bear the disproportionate burden of environmental degradation.', body: 'They manage households through water scarcity, crop failure, and displacement. Their leadership matters.' },
  { headline: 'Indigenous land rights are the most effective form of conservation.', body: 'Territories managed by indigenous communities have measurably better ecological outcomes.' },
  { headline: 'Environmental racism is documented and systemic.', body: 'Polluting facilities are disproportionately sited near communities of colour — consistently, globally.' },
  { headline: 'The wealthiest 1% produce more emissions than the poorest 50%.', body: 'Consumption inequality is inseparable from carbon inequality. Both require addressing.' },
  { headline: 'Children in climate-vulnerable nations bear costs they did not create.', body: 'Intergenerational equity and international equity are the same moral argument.' },
  { headline: 'Climate migration will reshape geopolitics this century.', body: 'Planning for just and orderly movement of people is a climate adaptation imperative.' },
  { headline: 'Access to green space is inequitably distributed in almost every city.', body: 'Where you can afford to live determines the nature you can access. That must change.' },
  { headline: 'Workers in high-emission industries need just transitions.', body: 'Abandoning fossil fuel workers is not a climate policy. It is a political failure.' },
  { headline: 'Gender equality accelerates environmental outcomes.', body: 'Every study of women\'s leadership in conservation and agriculture confirms the relationship.' },
  { headline: 'Health outcomes are worse near heavy industry — consistently.', body: 'Environmental protection is public health protection. They cannot be separated.' },
  { headline: 'Food deserts reflect infrastructure failures, not personal choices.', body: 'Access to healthy food is shaped by planning, investment, and political priority.' },
  { headline: 'Climate justice requires reparative finance from high-emitters.', body: 'Loss and damage funding for vulnerable nations is not charity. It is accountability.' },
  { headline: 'People of colour breathe significantly more polluted air.', body: 'This is documented across multiple countries. It is a policy failure, not a coincidence.' },
  { headline: 'Disability and climate intersect — heat is most deadly for disabled people.', body: 'Inclusive climate adaptation acknowledges that risk is not equally distributed.' },
  { headline: 'Educational attainment reduces both inequality and environmental impact.', body: 'Investing in education is investing in a more equitable and sustainable future simultaneously.' },
  { headline: 'Clean cooking access would save 4 million lives annually.', body: 'Indoor air pollution from solid fuels is one of the most tractable health and equity issues in the world.' },
  { headline: 'Economic participation rises when clean water access is assured.', body: 'Water access is the precondition for health, schooling, and livelihood — in that order.' },
  { headline: 'Historically excluded communities lead the most innovative solutions.', body: 'Necessity drives creativity. The communities most affected are often first to adapt.' },
  { headline: 'A living wage reduces reliance on cheap, high-impact consumption.', body: 'Economic security enables better choices. Poverty is not a sustainable lifestyle.' },
  { headline: 'Biodiversity loss hits nature-dependent communities hardest.', body: 'Fishers, farmers, and forest communities lose livelihoods when ecosystems collapse.' },
  { headline: 'Sustainable development must be locally owned.', body: 'Imposed solutions from outside rarely stick. Community agency is the design principle.' },
  { headline: 'Social capital is environmental capital.', body: 'Strong, trusting communities protect shared resources more effectively than regulation alone.' },
  { headline: 'Agroecology empowers the smallholders who feed 70% of the world.', body: 'Supporting small-scale diverse farming is both a food security and a justice strategy.' },
  { headline: 'Universal basic services could dramatically reduce emissions.', body: 'When housing, healthcare, and transport are public goods, private consumption falls.' },
  { headline: 'The SDGs are interdependent — you cannot achieve one without the others.', body: 'Poverty, health, education, and climate are aspects of the same systemic challenge.' },
  { headline: 'Green space investment is a health equity intervention.', body: 'Parks and nature access in low-income neighbourhoods are among the highest-value public expenditures.' },
  { headline: 'Sustainability that centres equity is more resilient.', body: 'Solutions designed for the most vulnerable tend to work better for everyone.' },
  { headline: 'The global south is leading renewable energy growth per capita.', body: 'The narrative of developing nations as laggards is being systematically disproved.' },
  { headline: 'Equity is not a footnote to sustainability. It is its foundation.', body: 'A world that is ecologically stable but deeply unequal is neither just nor durable.' },
  // ── Community & Collective Action (30: 246–275) ──
  { headline: 'Social norms change faster when they are visible. Be visible.', body: 'People change behaviour when they see others changing. Show what is possible.' },
  { headline: 'Every community has the capacity to lead on sustainability.', body: 'Not because it is easy — but because the tools, knowledge, and will are already present.' },
  { headline: 'Civic engagement is an environmental act.', body: 'Who holds power determines what happens to shared resources, land, and climate policy.' },
  { headline: 'One conversation with a neighbour can start a movement.', body: 'Social change travels through relationships. Talk to people in your actual life.' },
  { headline: 'Volunteering in nature improves mental health and ecological literacy.', body: 'Connection to place generates the motivation to protect it.' },
  { headline: 'Community gardens reduce food insecurity, isolation, and emissions.', body: 'They are one of the most efficient multi-benefit interventions available to any community.' },
  { headline: 'Collective purchasing power can transform supply chains.', body: 'When communities buy together — food co-ops, buying groups — they shift what producers offer.' },
  { headline: 'Local currencies keep value circulating in communities.', body: 'They reward local spending, strengthen small businesses, and increase community resilience.' },
  { headline: 'Schools that teach sustainability produce lifelong advocates.', body: 'Environmental literacy formed early shapes values and behaviour for decades.' },
  { headline: 'Transition Towns have shown community-led change works anywhere.', body: 'From Totnes to Tokyo, ordinary people have organised extraordinary local transitions.' },
  { headline: 'A group of neighbours with shared goals is the most powerful sustainability unit.', body: 'Not abstract. Not distant. But present, accountable, and motivated by shared place.' },
  { headline: 'Mutual aid networks are the original circular economy.', body: 'Neighbours sharing skills, food, tools, and time have always been more efficient than markets alone.' },
  { headline: 'Trust is the most underrated resource in any sustainability effort.', body: 'Without it, collective action fails. With it, almost anything becomes achievable.' },
  { headline: 'Participatory budgeting gives communities power over public spending.', body: 'When communities decide, sustainability priorities appear that top-down processes miss.' },
  { headline: 'Sports clubs, faith groups, and workplaces are powerful change platforms.', body: 'Every institution people belong to is a lever. Sustainability norms can travel through all of them.' },
  { headline: 'Every time you talk about sustainability, you normalise it.', body: 'Cultural change precedes policy change. Conversation is infrastructure.' },
  { headline: 'Voting is not the ceiling of civic action — it is the floor.', body: 'Between elections, lobbying, campaigning, and organising are all available to you.' },
  { headline: 'Planting trees together plants relationships. Both grow.', body: 'The social bond formed through shared action may outlast the tree.' },
  { headline: 'Co-operatives outperform conventional businesses in resilience.', body: 'Shared ownership aligns incentives in a way that pure profit-seeking cannot.' },
  { headline: 'The most effective climate communicators are trusted community members.', body: 'Not experts. Not celebrities. The person at the school gate or in the pub.' },
  { headline: '3.5% mobilised can create systemic change — history shows this.', body: 'You do not need a majority to shift a system. You need a committed, visible minority.' },
  { headline: 'Peer influence is powerful. Use it for good.', body: 'What your community sees you do matters more than you think.' },
  { headline: 'Community wealth building redirects economic power locally.', body: 'Anchor institutions, social enterprise, and local procurement can transform an economy.' },
  { headline: 'Citizen science expands what we know about local ecosystems.', body: 'Ordinary people collecting data have transformed our understanding of species and change.' },
  { headline: 'Intergenerational dialogue is essential to sustainability.', body: 'Elders hold ecological memory. Young people hold urgency. Both are needed.' },
  { headline: 'Libraries are sustainability infrastructure.', body: 'Shared knowledge, shared resources, shared space — the original sharing economy.' },
  { headline: 'Neighbourhood renewable energy schemes are the fastest-growing energy sector.', body: 'Community ownership of clean power is a reality, not a future aspiration.' },
  { headline: 'Grassroots advocacy has shifted corporate policy more than regulation alone.', body: 'Boycotts, campaigns, and sustained pressure have changed what major companies do.' },
  { headline: 'Business improvement districts are using sustainability as a strategy.', body: 'Local economies that invest in green infrastructure outperform those that do not.' },
  { headline: 'The opposite of apathy is not anger. It is community.', body: 'Belonging, purpose, and shared action are the antidote to helplessness.' },
  // ── Wellbeing & Nature Connection (30: 276–305) ──
  { headline: 'Time in nature reduces cortisol and restores attention.', body: 'The evidence base for nature\'s effect on mental health is growing rapidly — and consistently.' },
  { headline: 'Biophilic buildings improve productivity by 15%.', body: 'Nature inside buildings is not decoration. It is a performance intervention.' },
  { headline: 'Forest bathing is now prescribed by doctors in multiple countries.', body: 'Japan, South Korea, Finland, and others have formalised what humans have always known.' },
  { headline: 'Children who play in nature are more likely to protect it.', body: 'Conservation begins in childhood. Access to wild spaces shapes lifelong values.' },
  { headline: 'The wellbeing economy prioritises health and happiness over GDP.', body: 'Scotland, Wales, New Zealand, and Iceland are redefining what progress means.' },
  { headline: 'Green space access reduces inequality in health outcomes.', body: 'Where you live determines the nature you can access. That shapes how long you live.' },
  { headline: 'Sustainable food practices are linked to lower rates of depression.', body: 'Growing, cooking, and sharing food are protective factors for mental health.' },
  { headline: 'Urban rewilding improves air quality, temperature, and mental health.', body: 'It also increases biodiversity and creates beauty at relatively low cost.' },
  { headline: 'Silence is a finite resource. Natural soundscapes are irreplaceable.', body: 'Noise pollution is an underacknowledged health burden. Quiet is a public good.' },
  { headline: 'Connecting with where food comes from is a form of healing.', body: 'The disconnection between people and their food source is both ecological and psychological.' },
  { headline: 'Physical health and planetary health cannot be separated.', body: 'The same systems that produce clean air, water, and food support human bodies directly.' },
  { headline: 'Slow living is not a luxury — it is a lower-impact way of being.', body: 'Less speed means less consumption, less waste, and more attention to what matters.' },
  { headline: 'Climate anxiety motivates action when paired with agency.', body: 'The aim is not to eliminate the anxiety but to direct it into meaningful, connected action.' },
  { headline: 'Community meals connect people to food, culture, and each other.', body: 'Eating together reduces isolation, reduces food waste, and strengthens social fabric.' },
  { headline: 'A garden is a classroom, a pantry, and a medicine cabinet.', body: 'Growing things is one of the oldest human technologies. It remains one of the most valuable.' },
  { headline: 'Joy is a form of resistance. It sustains the long work.', body: 'Sustainability needs people who can go the distance. Joy is part of the fuel.' },
  { headline: 'Rest is not withdrawal from the work. It is its precondition.', body: 'Burnout serves no one. Pacing matters as much as pace.' },
  { headline: 'The attention economy extracts from us. Nature restores.', body: 'Screens deplete attention. Natural environments replenish it. The data is clear.' },
  { headline: 'Gratitude for what exists is the will to protect it.', body: 'We protect what we love. We love what we know. Know the natural world.' },
  { headline: 'Creativity flourishes in contact with the natural world.', body: 'Some of the most innovative thinking happens outdoors, or in spaces that bring nature in.' },
  { headline: 'Cultural connection to land is environmental stewardship.', body: 'Indigenous, rural, and traditional relationships with place are conservation technologies.' },
  { headline: 'Wild swimming advocates for the rivers and seas we swim in.', body: 'Personal connection to water bodies creates powerful advocates for their protection.' },
  { headline: 'Wellbeing and sustainability share a root — sufficiency over excess.', body: 'Enough is a radical concept in a growth economy. It is also a deeply human one.' },
  { headline: 'Nature-deficit disorder is measurable. So is its cure.', body: 'Children and adults who spend regular time outside are measurably healthier and happier.' },
  { headline: 'The intrinsic value of a forest is not its timber.', body: 'It is its being: its age, its complexity, its irreplaceability. That value is real.' },
  { headline: 'Sleep, food, movement, and connection are sustainability practices.', body: 'A person who is well cannot consume their way out of emptiness. Wellbeing reduces demand.' },
  { headline: 'What sustains the earth sustains the people on it.', body: 'The health of ecosystems and the health of communities are not separate concerns.' },
  { headline: 'Belonging somewhere motivates protecting it.', body: 'Place attachment is one of the most powerful drivers of environmental behaviour.' },
  { headline: 'The natural world does not need saving by heroes.', body: 'It needs to be allowed to recover — by humans consuming and disrupting less.' },
  { headline: 'Taking care of yourself is part of taking care of the world.', body: 'Sustainability is not a sacrifice. It is the practice of living within what the planet can give.' },
  // ── Future Generations (25: 306–330) ──
  { headline: 'Children born today will inherit this decade\'s decisions.', body: 'The emissions we lock in and the ecosystems we protect both outlast our lifetimes.' },
  { headline: 'Parental behaviour is the strongest predictor of children\'s environmental values.', body: 'More than any lesson or campaign. What you do, they will do.' },
  { headline: 'Long-termism in policy is basic risk management.', body: 'Ignoring 20-year risks to optimise for 4-year cycles is not pragmatism. It is negligence.' },
  { headline: 'Infrastructure built today will be used in 2100.', body: 'Buildings, roads, and energy systems built now will still be in use when today\'s children are old.' },
  { headline: 'The rights of future generations are entering constitutions worldwide.', body: 'Legal systems are beginning to recognise that those not yet born have interests that matter.' },
  { headline: 'A 20-year-old today will be 50 in 2055. Climate decisions are personal.', body: 'The gap between policy timelines and human lifetimes is smaller than it seems.' },
  { headline: 'Compound returns apply to ecological degradation.', body: 'Act before the interest on inaction compounds. Every year of delay raises the cost.' },
  { headline: 'Young people vote at lower rates but face longer consequences.', body: 'Lowering voting ages and improving civic education are climate policies.' },
  { headline: 'Intergenerational equity is the moral foundation of sustainability.', body: 'Future people matter. The resources they will need are being depleted now.' },
  { headline: 'The SDGs were designed to be achieved by 2030. We are off track.', body: 'Urgency is not alarmism. It is an accurate reading of where we stand.' },
  { headline: 'Every generation has left the world differently to how they found it.', body: 'We can choose what differently means — degraded or restored.' },
  { headline: 'Pension funds are the largest holders of fossil fuel assets.', body: 'Divestment and redirection toward clean energy is both ethical and financially rational.' },
  { headline: 'Legacy thinking — what do I want to leave behind? — is a sustainability practice.', body: 'The question changes what feels worth doing today.' },
  { headline: 'Future generations will judge us by our decisions, not our intentions.', body: 'Good intentions paired with inaction are still inaction. Decisions are what remain.' },
  { headline: 'Rewilding is an act of faith in the future.', body: 'Planting what you will not see, restoring what you did not damage. That is stewardship.' },
  { headline: 'Schools built today should be climate-resilient by design.', body: 'The children learning in them will live in a different climate. Design for theirs, not ours.' },
  { headline: 'Mentoring the next generation of sustainability leaders is climate action.', body: 'Knowledge, confidence, and connection passed on to young people have compound returns.' },
  { headline: 'What children learn about nature will shape how they protect it.', body: 'Ecological literacy is not a subject. It is a lens for understanding everything.' },
  { headline: 'The precautionary principle: if in doubt about harm, don\'t.', body: 'Future-proofing by design is cheaper and wiser than remediating damage after the fact.' },
  { headline: 'Fossil fuel subsidies are debts charged to future generations.', body: 'We are borrowing from the future to subsidise the present. The ledger will be presented.' },
  { headline: 'The best investment in the future is an empowered young person.', body: 'Education, agency, and resources given to young people generate returns for decades.' },
  { headline: 'Thinking in centuries is not naive. It is the original planning horizon.', body: 'Ancient forests, cathedrals, and commons were all designed for time beyond one lifetime.' },
  { headline: 'We stand on the shoulders of those who came before us.', body: 'Stand in a way that makes it easier for those who come after to stand on ours.' },
  { headline: 'Hope is not wishful thinking. It is a disciplined practice.', body: 'Evidence supports hope: technologies exist, movements are growing, change is possible.' },
  { headline: 'The future is not written. It is built — decision by decision.', body: 'Including this one. Including today.' },
  // ── Economic Systems & Consumption (35: 331–365) ──
  { headline: 'GDP measures activity — not wellbeing, equity, or sustainability.', body: 'A car crash increases GDP. So does cleaning up a spill. We are measuring the wrong things.' },
  { headline: 'The doughnut economy defines a safe and just space for humanity.', body: 'Stay above the social foundation. Stay below the ecological ceiling. It fits on one diagram.' },
  { headline: 'Degrowth does not mean poverty. It means measuring what matters.', body: 'Shorter weeks, better services, cleaner environments — growth in what matters.' },
  { headline: 'Consumption in the global north drives most environmental degradation.', body: 'The footprint of affluence is the largest single factor in planetary overshoot.' },
  { headline: 'Advertising creates wants. Sustainability begins with questioning them.', body: 'The distance between want and need is where most environmental impact lives.' },
  { headline: 'Planned obsolescence is a design philosophy — durability is a choice.', body: 'Products can be made to last. The decision not to is commercial, not technical.' },
  { headline: 'ESG investing is growing — but greenwashing is a real risk.', body: 'Demand rigorous, independently verified standards. Not all green is equally green.' },
  { headline: 'The cost of climate inaction exceeds the cost of action by 10 to 1.', body: 'This is not an environmental argument. It is a financial one — and it is robust.' },
  { headline: 'Circular business models generate higher margins and lower impact.', body: 'Companies that retain material value in their systems outcompete those that waste it.' },
  { headline: 'Fiduciary duty now includes climate risk.', body: 'Fund managers that ignore physical and transition risk are not acting in their clients\' interests.' },
  { headline: 'The fossil fuel industry has known about climate change since the 1970s.', body: 'Internal documents confirm it. The decades of delay were a deliberate choice.' },
  { headline: 'Consumer boycotts have shifted corporate behaviour throughout history.', body: 'From apartheid to plastic straws, sustained consumer pressure has moved major companies.' },
  { headline: 'Slow fashion, slow food, slow travel — the slow movement is sustainability.', body: 'Less speed, more intention, better quality, lower impact. The same logic applies everywhere.' },
  { headline: 'Natural capital accounting puts value on ecosystems.', body: 'When ecosystems appear on balance sheets, decisions about them change.' },
  { headline: 'True cost accounting includes environmental and social costs.', body: 'Cheap prices often hide costs externalised onto communities, ecosystems, and the future.' },
  { headline: 'The informal economy is often more resource-efficient than the formal one.', body: 'Repair, reuse, and local trade existed long before sustainability was a concept.' },
  { headline: 'Supply chain transparency is the first step to accountability.', body: 'You cannot manage what you cannot see. Transparency enables better decisions throughout.' },
  { headline: 'Buying less is the most powerful consumer act available.', body: 'Not which product to buy — whether to buy at all. That is the highest-leverage question.' },
  { headline: 'Business as usual is the riskiest strategy in a changing climate.', body: 'Physical risk, stranded assets, regulatory change, and reputational exposure all point the same way.' },
  { headline: 'Innovation does not require growth. It requires imagination.', body: 'Some of the most transformative innovations are about doing more with less.' },
  { headline: 'The most resilient economies are diversified and local.', body: 'Long supply chains and single-point dependencies are vulnerabilities, not efficiencies.' },
  { headline: 'Purpose-driven companies outperform profit-only ones in retention and satisfaction.', body: 'Workers stay longer and perform better when the mission connects to something beyond profit.' },
  { headline: 'Subsidy reform is the fastest single policy lever available.', body: 'Shifting support from fossil fuels to renewables does not require new money — only redirected money.' },
  { headline: 'Land value taxation incentivises development over speculation.', body: 'It reduces sprawl, increases housing supply, and discourages land hoarding.' },
  { headline: 'Fair pay reduces inequality and increases local spending.', body: 'Money earned by lower-income workers circulates locally. Money at the top tends to leave.' },
  { headline: 'Wellbeing budgets redefine what governments are for.', body: 'New Zealand, Scotland, and Iceland have shown it is possible to govern for flourishing, not just growth.' },
  { headline: 'Finance flows to what is measured. Measure what matters.', body: 'Carbon accounting, biodiversity accounting, and social accounting belong in every budget.' },
  { headline: 'The most powerful lever you have today is how you spend money.', body: 'Where money flows, power follows. Redirecting it is a form of governance.' },
  { headline: 'Economic systems are human inventions. They can be reinvented.', body: 'Markets, money, and property rights are not laws of nature. They are political choices.' },
  { headline: 'Green bonds are financing the transition — with conditions.', body: 'Standards, verification, and accountability matter. Not all green bonds are equal.' },
  { headline: 'Community wealth building redirects economic power downward.', body: 'Anchor institutions, worker ownership, and local procurement change who benefits from economic activity.' },
  { headline: 'The gig economy\'s hidden cost is emissions from delivery and transport.', body: 'Convenience has a carbon price. It is rarely shown at checkout.' },
  { headline: 'Sharing is the original sustainable business model.', body: 'Libraries, commons, and mutual aid predate markets. They still work — often better.' },
  { headline: 'Corporate carbon accounting is improving. Demand transparency.', body: 'Scope 3 emissions — those in supply chains — are where most corporate impact lies.' },
  { headline: 'The future is not written. It is built — by decisions made today, and every day after.', body: 'Including yours. Including this one.' },
]

function getDailyMotivation() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  return DAILY_MESSAGES[dayOfYear % DAILY_MESSAGES.length]
}

function CasuarinaFooter() {
  return (
    <div style={{
      textAlign: 'center', padding: '20px 0 10px',
      fontFamily: "'Oswald', sans-serif", fontSize: 10,
      letterSpacing: '0.18em', textTransform: 'uppercase',
      color: 'rgba(26,51,40,0.28)',
    }}>
      Casuarina Consulting
    </div>
  )
}

export default function ImpactPage() {
  const navigate = useNavigate()
  const { data, isLoading } = useQuery({
    queryKey: ['impact'],
    queryFn: () => api.get('/impact').then(r => r.data),
  })

  const totalActions = data?.totalActions ?? 0
  const motivation   = getDailyMotivation()

  const stats = [
    { icon: '🌬️', label: 'CO₂ saved',       value: `${(data?.co2Saved ?? 0).toFixed(1)} kg`,     color: '#5e7a44' },
    { icon: '💧', label: 'Water saved',      value: `${(data?.waterSaved ?? 0).toFixed(0)} L`,     color: '#2b8fb5' },
    { icon: '♻️', label: 'Waste diverted',   value: `${(data?.wasteDiverted ?? 0).toFixed(1)} kg`, color: '#7b68ae' },
    { icon: '🌳', label: 'Trees equivalent', value: `${(data?.treesEquiv ?? 0).toFixed(2)}`,       color: '#2a9d8f' },
    { icon: '✅', label: 'Total actions',    value: `${totalActions}`,                              color: '#c8952a' },
  ]

  return (
    <div className="min-h-screen pb-10" style={{ background: 'var(--cream)' }}>

      {/* ── Header ── */}
      <div style={{ background: '#1b4332' }}>
        <div style={{ padding: '52px 22px 20px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              color: 'rgba(255,255,255,0.55)', fontSize: 13, background: 'none',
              border: 'none', cursor: 'pointer', marginBottom: 12, padding: 0,
              fontFamily: "'Oswald', sans-serif", letterSpacing: '0.06em',
            }}
          >
            ← Back
          </button>
          <h1 style={{
            color: '#fff', fontFamily: "'Oswald', sans-serif",
            fontWeight: 600, fontSize: 26, margin: 0,
          }}>
            Your Impact
          </h1>
          <p style={{ color: '#95d5b2', fontSize: 13, marginTop: 4 }}>Every action adds up</p>
        </div>
        <ImpactWave />
      </div>

      {/* ── Stats grid — 3 rows × 2 cols ── */}
      <div style={{ padding: '20px 18px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

        {isLoading
          ? [1,2,3,4,5,6].map(i => (
              <div key={i} className="animate-pulse"
                   style={{ height: 100, borderRadius: 14, background: '#e5e7eb' }} />
            ))
          : <>
              {stats.map(s => (
                <div key={s.label} style={{
                  background: '#fff', borderRadius: 14,
                  padding: '14px 14px 16px',
                  border: '1px solid #ebebeb',
                  boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
                }}>
                  <span style={{ fontSize: 22 }}>{s.icon}</span>
                  <p style={{
                    fontFamily: "'Oswald', sans-serif", fontWeight: 600,
                    fontSize: 22, color: s.color, margin: '6px 0 2px',
                  }}>
                    {s.value}
                  </p>
                  <p style={{ fontSize: 11.5, color: '#888', margin: 0 }}>{s.label}</p>
                </div>
              ))}

              {/* ── 6th card: motivational (right of Total actions) ── */}
              <div style={{
                background: '#1b4332', borderRadius: 14,
                padding: '14px 14px 16px',
                position: 'relative', overflow: 'hidden',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}>
                <span style={{
                  position: 'absolute', right: 8, top: 6,
                  fontSize: 36, opacity: 0.07, userSelect: 'none',
                }}>
                  🌍
                </span>
                <div>
                  <p style={{
                    fontFamily: "'Oswald', sans-serif", fontWeight: 600,
                    fontSize: 13, color: '#c8952a', margin: '0 0 6px',
                    lineHeight: 1.3,
                  }}>
                    {motivation.headline}
                  </p>
                  <p style={{
                    fontSize: 11.5, color: 'rgba(255,255,255,0.6)',
                    lineHeight: 1.55, margin: 0,
                  }}>
                    {motivation.body}
                  </p>
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6, marginTop: 12,
                }}>
                  <div style={{ width: 16, height: 1, background: 'rgba(255,255,255,0.2)' }} />
                  <span style={{ fontSize: 9, opacity: 0.35 }}>🌿</span>
                </div>
              </div>
            </>
        }
      </div>

      <CasuarinaFooter />
    </div>
  )
}
