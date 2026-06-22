import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import BottomNav from '../components/BottomNav'

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
  // ── Climate (25) ──
  { headline: 'Climate justice starts with daily choices.', body: 'Climate change hits hardest those who did least to cause it. Every action helps close that gap.' },
  { headline: 'The warmest years on record are the last ten.', body: 'This is not a trend. It is a trajectory — and daily choices bend it.' },
  { headline: '1.5°C is not just a number.', body: 'It is a threshold separating manageable change from cascading, irreversible harm.' },
  { headline: 'Carbon is invisible. Its impacts are not.', body: 'Floods, droughts, displacement — every emission has a consequence, even if delayed.' },
  { headline: 'The climate crisis is also a health crisis.', body: 'Air pollution, extreme heat, and food insecurity are already killing millions annually.' },
  { headline: 'Every fraction of a degree matters.', body: 'The difference between 1.5°C and 2°C is hundreds of millions of lives and livelihoods.' },
  { headline: 'Tipping points are real — and avoidable.', body: 'Keeping systems stable requires action now, while we still have the margin.' },
  { headline: 'The atmosphere has no borders.', body: 'What any nation emits, every nation bears. Climate is the ultimate shared commons.' },
  { headline: 'Cities produce 70% of global CO₂ emissions.', body: 'They are also where the most powerful solutions are being tested and deployed.' },
  { headline: 'The Arctic is warming four times faster than average.', body: 'What happens there reshapes weather patterns for the entire planet.' },
  { headline: 'Climate change amplifies every existing inequality.', body: 'Poverty, gender disparity, and race all determine who suffers most.' },
  { headline: '3.3 billion people live in climate-vulnerable areas.', body: 'Most contributed least to the problem. Equity is not optional — it is the point.' },
  { headline: 'Coastal communities are already relocating.', body: 'Sea-level rise is not a future scenario. It is a present reality for millions.' },
  { headline: 'Heat islands hit low-income neighbourhoods hardest.', body: 'Urban greening, white roofs, and shading are acts of both ecology and justice.' },
  { headline: 'Climate resilience starts in the soil.', body: 'Healthy soil absorbs water, sequesters carbon, and keeps food systems stable.' },
  { headline: 'Air pollution kills 7 million people annually.', body: 'Most of those deaths are preventable with cleaner energy and transport.' },
  { headline: 'The world has the solutions.', body: 'Solar, wind, efficiency, and behaviour change can do the job. What is needed is will.' },
  { headline: 'Young people are leading the climate movement.', body: 'They are striking, litigating, and organising because the timeline is theirs.' },
  { headline: 'Indigenous communities protect 80% of biodiversity.', body: 'Their land rights and knowledge systems are climate solutions — not footnotes.' },
  { headline: 'Climate anxiety is a rational response.', body: 'Channelled into action and community, it becomes one of the most productive forces available.' },
  { headline: 'Mitigation and adaptation must happen at once.', body: 'Cutting emissions is not enough if we do not protect communities already at risk.' },
  { headline: 'Net zero by 2050 requires action this decade.', body: 'The carbon budget does not wait. Early action costs far less than delayed action.' },
  { headline: 'The energy transition is the great economic opportunity.', body: 'It creates more jobs, improves health, and reduces geopolitical risk simultaneously.' },
  { headline: 'Climate inaction has a price tag.', body: 'The cost of unmitigated climate change dwarfs the cost of acting now by a factor of 10.' },
  { headline: 'You are part of the climate solution.', body: 'Not the whole solution — but a real and meaningful part of it. That counts.' },
  // ── Water (20) ──
  { headline: 'Water is not infinite.', body: 'Treat every litre as though it matters — because it does, to someone somewhere.' },
  { headline: '2 billion people lack access to safe drinking water.', body: 'Water security is the most basic form of human security.' },
  { headline: 'By 2050, half the world may face water scarcity.', body: 'Conservation now is not sacrifice — it is preparation for the world we are building.' },
  { headline: 'Groundwater is depleted faster than it refills.', body: 'Aquifers that took millennia to fill are being emptied in decades.' },
  { headline: 'Wetlands filter water, store carbon, and prevent floods.', body: 'They are the most cost-effective water infrastructure on the planet.' },
  { headline: 'A cotton t-shirt takes 2,700 litres to produce.', body: 'Virtual water is embedded in everything we buy. Consuming less conserves water invisibly.' },
  { headline: 'Water is a human right — not a commodity.', body: 'When access depends on ability to pay, the most vulnerable always lose first.' },
  { headline: 'Rivers that reach the sea are becoming rare.', body: 'Over-extraction upstream is one of the most visible signs of a system in crisis.' },
  { headline: '1 in 3 schools globally lacks clean water and sanitation.', body: 'Water access shapes who can learn, who can work, and who can participate.' },
  { headline: 'Glaciers provide freshwater to a billion people.', body: 'They are retreating. Communities downstream are already planning for what comes next.' },
  { headline: 'Plastic pollution affects 700 aquatic species.', body: 'Clean water and clean oceans require the same upstream solution: less plastic produced.' },
  { headline: 'Water-borne disease kills more children than any war.', body: 'Sanitation investment is one of the highest-return health and equity interventions available.' },
  { headline: 'Access to sanitation is a gender issue.', body: 'Girls miss school and women face safety risks when sanitation is absent or inadequate.' },
  { headline: 'Clean rivers begin with what we pour down the drain.', body: 'Every household is upstream of something. Act accordingly.' },
  { headline: 'The water cycle connects every ecosystem on earth.', body: 'Forest loss disrupts rainfall thousands of miles away. Nothing is isolated.' },
  { headline: 'Drinking water quality remains unequal in wealthy nations.', body: 'Infrastructure neglect in low-income areas is a political choice, not an inevitability.' },
  { headline: 'Restoring floodplains is cheaper than building flood defences.', body: 'Nature-based solutions outperform engineered ones in cost, longevity, and co-benefits.' },
  { headline: 'Water stress is already driving conflict.', body: 'Resource scarcity and climate change are inseparable from geopolitical instability.' },
  { headline: 'Rainwater harvesting is ancient and effective.', body: 'One of our oldest technologies is one of our most relevant solutions right now.' },
  { headline: 'The cheapest litre of water is always the one not wasted.', body: 'Efficiency is the fastest, cheapest route to closing the global water gap.' },
  // ── Biodiversity (20) ──
  { headline: 'One million species face extinction.', body: 'Most have not yet been named. We are losing what we have barely begun to understand.' },
  { headline: 'Biodiversity is the immune system of the planet.', body: 'Diverse ecosystems resist disease, recover from shock, and provide stability for everything else.' },
  { headline: '75% of food crops depend on pollinators.', body: 'Protecting insects is not abstract environmentalism. It is food security.' },
  { headline: 'Soil holds more species than any rainforest canopy.', body: 'A teaspoon of healthy soil contains more organisms than there are people on earth.' },
  { headline: 'Mangroves protect coasts, store carbon, and nurse fisheries.', body: 'Restoring them delivers more value per hectare than almost any other intervention.' },
  { headline: '70% of global deforestation is driven by agriculture.', body: 'What we eat is the most direct link between human choices and forest loss.' },
  { headline: 'Rewilding produces cascading positive effects.', body: 'Reintroducing one species can change river courses, restore plant communities, and recover soils.' },
  { headline: 'Coral reefs support a quarter of all marine species.', body: 'At 1.5°C of warming, 70–90% of corals are at risk.' },
  { headline: 'Urban gardens are corridors for pollinators.', body: 'Every garden, balcony, and verge planted with natives is a piece of connected habitat.' },
  { headline: 'Old-growth forests store far more carbon than plantations.', body: 'Age, complexity, and diversity are not replaceable by rows of identical trees.' },
  { headline: 'Fish populations have halved since 1970.', body: 'Sustainable fisheries management exists. The political will to enforce it is the missing ingredient.' },
  { headline: 'Peatlands store twice the carbon of all forests combined.', body: 'They cover just 3% of land. Protecting them is one of the most leveraged climate acts.' },
  { headline: 'Seed banks are the vaults of our food future.', body: 'Crop diversity is our insurance against disease, drought, and climate disruption.' },
  { headline: 'The sixth mass extinction is the first caused by one species.', body: 'That makes us unique in geological history — and uniquely responsible.' },
  { headline: 'Fungi connect forests — the original internet.', body: 'Mycorrhizal networks share nutrients between trees. Damaging soil severs these connections.' },
  { headline: 'Seagrass sequesters carbon 35x faster than tropical forests.', body: 'Marine ecosystems are among the most powerful carbon sinks we have — and the most neglected.' },
  { headline: 'Every species lost takes irreplaceable knowledge with it.', body: 'Evolutionary solutions to problems we have not yet encountered disappear with each extinction.' },
  { headline: 'We are nature. What we do to it, we do to ourselves.', body: 'The boundary between human and ecological wellbeing is not a line. It never was.' },
  { headline: 'Native plants support 10x more wildlife than ornamentals.', body: 'They have co-evolved with local insects and birds over thousands of years.' },
  { headline: 'Nature-based solutions can deliver a third of climate mitigation.', body: 'Protecting and restoring ecosystems is both a climate and a biodiversity strategy.' },
  // ── Food (20) ──
  { headline: 'A plant-rich diet is the highest-impact dietary choice.', body: 'No single food decision reduces emissions, land use, and water consumption as much.' },
  { headline: 'Food waste is the third-largest emitter — if it were a country.', body: 'Wasting food wastes every resource used to grow, transport, and refrigerate it.' },
  { headline: '820 million people go hungry while 30% of food is wasted.', body: 'This is not a production failure. It is a distribution and waste failure.' },
  { headline: 'Regenerative agriculture rebuilds soil and sequesters carbon.', body: 'It is not just a farming method — it is a climate intervention at landscape scale.' },
  { headline: 'Seasonal and local food loses fewer nutrients in transit.', body: 'It also costs less, supports local farmers, and travels a fraction of the distance.' },
  { headline: 'Crop diversity has collapsed by 75% in a century.', body: 'The narrowing of our food base is a fragility. Diverse diets support diverse farms.' },
  { headline: 'Overfishing threatens the protein source of 3 billion people.', body: 'Sustainable catch limits are science-based. Enforcing them is a political choice.' },
  { headline: 'Composting diverts food waste and creates free fertiliser.', body: 'What leaves the kitchen as waste can return to the garden as soil health.' },
  { headline: 'Community-supported agriculture shortens supply chains.', body: 'Direct relationships between growers and eaters build food security and trust.' },
  { headline: 'The average meal travels 1,500 miles before you eat it.', body: 'Every shorter food mile is a smaller carbon footprint and a more resilient supply chain.' },
  { headline: 'Reducing red meat is one of the fastest personal emissions cuts.', body: 'You do not need to be perfect. Eating less, less often, already makes a difference.' },
  { headline: 'Kitchen gardens reconnect people with where food comes from.', body: 'Growing anything — even herbs on a windowsill — changes how you relate to food.' },
  { headline: 'Eating lower on the food chain is lighter on the planet.', body: 'The further a food is from a plant, the more energy was used to produce it.' },
  { headline: 'Urban farming is scaling in every major city.', body: 'Rooftop gardens, vertical farms, and community plots are changing urban food geography.' },
  { headline: 'Fair trade ensures farmers receive equitable payment.', body: 'The price of cheap coffee and chocolate is paid by the people who grow it.' },
  { headline: 'Food culture is inseparable from ecological culture.', body: 'How a community grows and shares food reflects its relationship with the land.' },
  { headline: 'Soil health is food security.', body: 'Degraded soils cannot support the crops the world needs. Regeneration is not optional.' },
  { headline: 'Food sovereignty is the right to define your own food system.', body: 'Communities and nations that control their food supply are more resilient to shocks.' },
  { headline: 'What we grow shapes the landscape for everyone.', body: 'Agricultural choices are land use choices. Land use choices are ecological choices.' },
  { headline: 'Food banks treat a symptom. Food equity addresses the cause.', body: 'Hunger in wealthy nations is a policy failure — one that can be reversed.' },
  // ── Energy (20) ──
  { headline: 'Solar is now the cheapest electricity in history.', body: 'The cost has fallen 90% in a decade. The transition is not coming — it is happening.' },
  { headline: 'Energy efficiency is cheaper than any new power source.', body: 'The cheapest unit of energy is always the one you do not use.' },
  { headline: 'Heat pumps are 3x more efficient than gas boilers.', body: 'They work in cold climates and improve as the grid gets cleaner.' },
  { headline: 'Energy poverty affects 800 million people globally.', body: 'Access to clean, reliable energy is the foundation of education, health, and economic participation.' },
  { headline: 'The sun delivers more energy in an hour than we use in a year.', body: 'The resource is not the constraint. Distribution, storage, and policy are.' },
  { headline: 'Insulation is the most cost-effective energy intervention.', body: 'Warm, draught-free homes reduce bills, improve health, and cut emissions simultaneously.' },
  { headline: 'Community energy projects create local ownership over power.', body: 'When communities own their generation, the benefits stay local.' },
  { headline: 'Energy co-operatives are among the fastest-growing civic enterprises.', body: 'Citizens owning their energy infrastructure is both a climate and a democracy story.' },
  { headline: 'Buildings can generate as much energy as they consume.', body: 'Net-zero buildings exist today. They are not experimental — they are scalable.' },
  { headline: 'Demand reduction is always the first and cheapest step.', body: 'Before installing renewables, reduce the load they need to meet.' },
  { headline: 'Electrification of transport, heating, and industry is the priority.', body: 'A clean grid powers everything. Fossil fuels in each sector must be replaced.' },
  { headline: 'Energy access and energy justice must be designed together.', body: 'A transition that leaves the poorest behind is not a just transition.' },
  { headline: 'Decentralised energy gives communities resilience.', body: 'Distributed generation means no single failure point and more democratic ownership.' },
  { headline: 'The clean energy transition creates 3 jobs per fossil fuel job lost.', body: 'With planning and investment, no worker needs to be left behind.' },
  { headline: 'Cooking with clean fuels protects indoor air quality.', body: 'Household air pollution from solid fuels kills 4 million people a year — mostly women and children.' },
  { headline: 'Offshore wind generates power without competing for land.', body: 'Coastal nations have enormous capacity that is still barely tapped.' },
  { headline: 'Every new fossil fuel project delays the transition.', body: 'Infrastructure built today locks in emissions for 20–40 years. The timing matters.' },
  { headline: 'Battery storage costs are falling faster than any technology in history.', body: 'The variable renewable challenge is becoming a storage and grid management challenge.' },
  { headline: 'Smart grids balance supply and demand in real time.', body: 'The intelligence of the grid is what makes high penetrations of renewables feasible.' },
  { headline: 'The energy transition is the largest infrastructure project in history.', body: 'It is also the most distributed — happening in homes, communities, and cities worldwide.' },
  // ── Transport (15) ──
  { headline: 'Transport accounts for 24% of global CO₂ emissions.', body: 'It is one of the hardest sectors to decarbonise — and one of the most important.' },
  { headline: 'Walking and cycling are the only truly zero-emission modes.', body: 'They also improve health, reduce congestion, and cost nothing to operate at scale.' },
  { headline: 'A full bus removes 40 cars from the road.', body: 'Public transport is a climate intervention, a congestion solution, and an equity strategy.' },
  { headline: 'Aviation is the fastest-growing transport emissions source.', body: 'Flying less — especially long-haul and frequent short-haul — is high-leverage action.' },
  { headline: 'High-speed rail uses 90% less energy than flying the same route.', body: 'Europe\'s night train revival shows the alternative already exists and is growing.' },
  { headline: '15-minute cities reduce car dependency by design.', body: 'When daily needs are within walking or cycling distance, car use falls naturally.' },
  { headline: 'Cycling infrastructure pays back through healthcare savings.', body: 'The return on investment in cycling is among the highest of any transport intervention.' },
  { headline: 'Shared mobility reduces vehicles needed by a factor of 10.', body: 'Access without ownership — car clubs, e-bikes, and ride-sharing — changes the maths entirely.' },
  { headline: 'Accessible public transport enables economic participation.', body: 'For those without cars, the quality of public transport determines the quality of opportunity.' },
  { headline: 'E-bikes are the fastest-selling transport product in Europe.', body: 'They are extending the range and appeal of cycling beyond what human legs could manage.' },
  { headline: 'Children who walk to school are healthier and perform better.', body: 'Safe routes to school are a public health, equity, and sustainability intervention combined.' },
  { headline: 'Transport inequality leaves rural and low-income communities behind.', body: 'Designing inclusive transport systems is a justice imperative, not an afterthought.' },
  { headline: 'Car-free streets increase footfall and community wellbeing.', body: 'Every major city that has tried it has found retail improves and communities strengthen.' },
  { headline: 'The most sustainable journey is one not made by car.', body: 'Not because cars are evil — but because every trip has options worth considering.' },
  { headline: 'Urban sprawl is a transport problem as much as a land use one.', body: 'Compact, mixed-use development is the antidote to car dependency.' },
  // ── Waste & Circular Economy (20) ──
  { headline: 'The circular economy could unlock $4.5 trillion in value.', body: 'Waste is a design failure. Good design produces no waste — and more value.' },
  { headline: 'Only 9% of plastic ever produced has been recycled.', body: 'Recycling is not the solution. Producing less plastic is the solution.' },
  { headline: 'Electronics are the fastest-growing waste stream.', body: 'Right to repair, modular design, and take-back schemes are the tools to address it.' },
  { headline: 'The right to repair is both a sustainability and a consumer right.', body: 'When products are designed to be fixed, they last longer and waste less.' },
  { headline: 'Fashion is the second most polluting industry.', body: 'Buying less, buying better, and keeping clothes longer is the most direct response.' },
  { headline: 'A garment worn 30 times instead of 3 cuts its footprint by 90%.', body: 'Longevity is the highest sustainability metric in clothing.' },
  { headline: 'Landfill emits methane — 80x more potent than CO₂ at 20 years.', body: 'What goes to landfill does not disappear. It becomes a long-term emission source.' },
  { headline: 'Single-use plastic bans measurably reduce ocean contamination.', body: 'Policy works. The evidence from bans in dozens of countries is consistent.' },
  { headline: 'Industrial symbiosis: one company\'s waste is another\'s raw material.', body: 'The circular economy existed in ecosystems for billions of years. We are relearning it.' },
  { headline: 'The sharing economy reduces products that need to be made.', body: 'Access over ownership is both a financial and an environmental strategy.' },
  { headline: 'Second-hand clothing markets grow 3x faster than new clothing.', body: 'Resale, rental, and swapping are becoming mainstream — not niche.' },
  { headline: 'Glass and aluminium can be recycled infinitely without quality loss.', body: 'These are the materials worth designing for recovery.' },
  { headline: 'The throwaway culture is a post-war invention.', body: 'It was deliberately engineered by industry. It can be deliberately unengineered.' },
  { headline: 'Zero-waste stores prove packaging-free is commercially viable.', body: 'Consumer demand exists. What has been missing is the supply infrastructure.' },
  { headline: 'Ocean plastic cleanup cannot solve the plastic crisis alone.', body: 'Reduction at source is the only strategy that addresses the root cause.' },
  { headline: 'A phone repaired is a phone not mined from new materials.', body: 'Every repair is a small act of resource conservation.' },
  { headline: 'Every item bought second-hand avoids a new manufacture.', body: 'The carbon, water, and material cost of making something new is avoided entirely.' },
  { headline: 'What we call waste, nature calls food.', body: 'In ecosystems, every output is an input for something else. That is the model.' },
  { headline: 'Product-as-a-service incentivises durability over disposal.', body: 'When companies retain ownership, they have every reason to make things last.' },
  { headline: 'Waste reduction is wealth creation — for households and economies.', body: 'Every resource not wasted is a resource retained.' },
  // ── Social Equity & Justice (25) ──
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
  { headline: 'Climate justice requires reparative finance from high-emitters.', body: 'Loss and damage funding for vulnerable nations is accountability, not charity.' },
  { headline: 'Educational attainment reduces both inequality and environmental impact.', body: 'Investing in education is investing in a more equitable and sustainable future simultaneously.' },
  { headline: 'Clean cooking access would save 4 million lives annually.', body: 'Indoor air pollution from solid fuels is one of the most tractable health and equity issues in the world.' },
  { headline: 'A living wage reduces reliance on cheap, high-impact consumption.', body: 'Economic security enables better choices. Poverty is not a sustainable lifestyle.' },
  { headline: 'Biodiversity loss hits nature-dependent communities hardest.', body: 'Fishers, farmers, and forest communities lose livelihoods when ecosystems collapse.' },
  { headline: 'Sustainable development must be locally owned.', body: 'Imposed solutions rarely stick. Community agency is the design principle.' },
  { headline: 'Agroecology empowers the smallholders who feed 70% of the world.', body: 'Supporting small-scale diverse farming is both a food security and a justice strategy.' },
  { headline: 'Universal basic services could dramatically reduce emissions.', body: 'When housing, healthcare, and transport are public goods, private consumption falls.' },
  { headline: 'The SDGs are interdependent — you cannot achieve one without the others.', body: 'Poverty, health, education, and climate are aspects of the same systemic challenge.' },
  { headline: 'Sustainability that centres equity is more resilient.', body: 'Solutions designed for the most vulnerable tend to work better for everyone.' },
  { headline: 'Social capital is environmental capital.', body: 'Strong, trusting communities protect shared resources more effectively than regulation alone.' },
  { headline: 'Equity is not a footnote to sustainability. It is its foundation.', body: 'A world that is ecologically stable but deeply unequal is neither just nor durable.' },
  { headline: 'People of colour breathe significantly more polluted air.', body: 'This is documented across multiple countries. It is a policy failure, not a coincidence.' },
  // ── Community & Collective Action (25) ──
  { headline: 'Social norms change faster when they are visible. Be visible.', body: 'People change behaviour when they see others changing. Show what is possible.' },
  { headline: 'Every community has the capacity to lead on sustainability.', body: 'The tools, knowledge, and will are already present. What is needed is organisation.' },
  { headline: 'Civic engagement is an environmental act.', body: 'Who holds power determines what happens to shared resources, land, and climate policy.' },
  { headline: 'One conversation with a neighbour can start a movement.', body: 'Social change travels through relationships. Talk to people in your actual life.' },
  { headline: 'Volunteering in nature improves mental health and ecological literacy.', body: 'Connection to place generates the motivation to protect it.' },
  { headline: 'Community gardens reduce food insecurity, isolation, and emissions.', body: 'They are one of the most efficient multi-benefit interventions available.' },
  { headline: 'Collective purchasing power can transform supply chains.', body: 'When communities buy together, they shift what producers offer.' },
  { headline: 'Schools that teach sustainability produce lifelong advocates.', body: 'Environmental literacy formed early shapes values and behaviour for decades.' },
  { headline: 'A group of neighbours with shared goals is the most powerful sustainability unit.', body: 'Not abstract, not distant — present, accountable, motivated by shared place.' },
  { headline: 'Mutual aid networks are the original circular economy.', body: 'Neighbours sharing skills, food, tools, and time have always been more efficient than markets alone.' },
  { headline: 'Trust is the most underrated resource in any sustainability effort.', body: 'Without it, collective action fails. With it, almost anything becomes achievable.' },
  { headline: 'Every time you talk about sustainability, you normalise it.', body: 'Cultural change precedes policy change. Conversation is infrastructure.' },
  { headline: 'Voting is not the ceiling of civic action — it is the floor.', body: 'Between elections, lobbying, campaigning, and organising are all available to you.' },
  { headline: 'Co-operatives outperform conventional businesses in resilience.', body: 'Shared ownership aligns incentives in a way that pure profit-seeking cannot.' },
  { headline: 'The most effective climate communicators are trusted community members.', body: 'Not experts. Not celebrities. The person at the school gate or in the pub.' },
  { headline: '3.5% mobilised can create systemic change — history shows this.', body: 'You do not need a majority to shift a system. You need a committed, visible minority.' },
  { headline: 'Intergenerational dialogue is essential to sustainability.', body: 'Elders hold ecological memory. Young people hold urgency. Both are needed.' },
  { headline: 'Libraries are sustainability infrastructure.', body: 'Shared knowledge, shared resources, shared space — the original sharing economy.' },
  { headline: 'Grassroots advocacy has shifted corporate policy more than regulation alone.', body: 'Sustained pressure from communities has changed what major companies do.' },
  { headline: 'The opposite of apathy is not anger. It is community.', body: 'Belonging, purpose, and shared action are the antidote to helplessness.' },
  { headline: 'Participatory budgeting gives communities power over public spending.', body: 'When communities decide, sustainability priorities appear that top-down processes miss.' },
  { headline: 'Local currencies keep value circulating in communities.', body: 'They reward local spending, strengthen small businesses, and increase resilience.' },
  { headline: 'Citizen science expands what we know about local ecosystems.', body: 'Ordinary people collecting data have transformed our understanding of species and change.' },
  { headline: 'Neighbourhood renewable energy schemes are the fastest-growing energy sector.', body: 'Community ownership of clean power is a reality, not a future aspiration.' },
  { headline: 'Planting trees together plants relationships. Both grow.', body: 'The social bond formed through shared action may outlast the tree.' },
  // ── Wellbeing & Nature Connection (20) ──
  { headline: 'Time in nature reduces cortisol and restores attention.', body: 'The evidence base for nature\'s effect on mental health is growing rapidly — and consistently.' },
  { headline: 'Forest bathing is now prescribed by doctors in multiple countries.', body: 'Japan, South Korea, Finland, and others have formalised what humans have always known.' },
  { headline: 'Children who play in nature are more likely to protect it.', body: 'Conservation begins in childhood. Access to wild spaces shapes lifelong values.' },
  { headline: 'The wellbeing economy prioritises health and happiness over GDP.', body: 'Scotland, Wales, New Zealand, and Iceland are redefining what progress means.' },
  { headline: 'Sustainable food practices are linked to lower rates of depression.', body: 'Growing, cooking, and sharing food are protective factors for mental health.' },
  { headline: 'Urban rewilding improves air quality, temperature, and mental health.', body: 'It also increases biodiversity and creates beauty at relatively low cost.' },
  { headline: 'Silence is a finite resource. Natural soundscapes are irreplaceable.', body: 'Noise pollution is an underacknowledged health burden. Quiet is a public good.' },
  { headline: 'Slow living is not a luxury — it is a lower-impact way of being.', body: 'Less speed means less consumption, less waste, and more attention to what matters.' },
  { headline: 'Climate anxiety motivates action when paired with agency.', body: 'The aim is not to eliminate the anxiety but to direct it into meaningful, connected action.' },
  { headline: 'Community meals connect people to food, culture, and each other.', body: 'Eating together reduces isolation, reduces food waste, and strengthens social fabric.' },
  { headline: 'Joy is a form of resistance. It sustains the long work.', body: 'Sustainability needs people who can go the distance. Joy is part of the fuel.' },
  { headline: 'Rest is not withdrawal from the work. It is its precondition.', body: 'Burnout serves no one. Pacing matters as much as pace.' },
  { headline: 'The attention economy extracts from us. Nature restores.', body: 'Screens deplete attention. Natural environments replenish it. The data is clear.' },
  { headline: 'Nature-deficit disorder is measurable. So is its cure.', body: 'Children and adults who spend regular time outside are measurably healthier and happier.' },
  { headline: 'Wild swimming advocates for the rivers and seas we swim in.', body: 'Personal connection to water bodies creates powerful advocates for their protection.' },
  { headline: 'Wellbeing and sustainability share a root — sufficiency over excess.', body: 'Enough is a radical concept in a growth economy. It is also a deeply human one.' },
  { headline: 'What sustains the earth sustains the people on it.', body: 'The health of ecosystems and the health of communities are not separate concerns.' },
  { headline: 'Taking care of yourself is part of taking care of the world.', body: 'Sustainability is not a sacrifice. It is the practice of living within what the planet can give.' },
  { headline: 'Belonging somewhere motivates protecting it.', body: 'Place attachment is one of the most powerful drivers of environmental behaviour.' },
  { headline: 'Gratitude for what exists is the will to protect it.', body: 'We protect what we love. We love what we know. Know the natural world.' },
  // ── Future Generations (20) ──
  { headline: 'Children born today will inherit this decade\'s decisions.', body: 'The emissions we lock in and the ecosystems we protect both outlast our lifetimes.' },
  { headline: 'Parental behaviour is the strongest predictor of children\'s environmental values.', body: 'More than any lesson or campaign. What you do, they will do.' },
  { headline: 'Long-termism in policy is basic risk management.', body: 'Ignoring 20-year risks to optimise for 4-year cycles is not pragmatism. It is negligence.' },
  { headline: 'Infrastructure built today will be used in 2100.', body: 'Buildings, roads, and energy systems built now will still be in use when today\'s children are old.' },
  { headline: 'The rights of future generations are entering constitutions worldwide.', body: 'Legal systems are beginning to recognise that those not yet born have interests that matter.' },
  { headline: 'Compound returns apply to ecological degradation.', body: 'Act before the interest on inaction compounds. Every year of delay raises the cost.' },
  { headline: 'Young people vote at lower rates but face longer consequences.', body: 'Lowering voting ages and improving civic education are themselves climate policies.' },
  { headline: 'Intergenerational equity is the moral foundation of sustainability.', body: 'Future people matter. The resources they will need are being depleted now.' },
  { headline: 'Pension funds are the largest holders of fossil fuel assets.', body: 'Divestment and redirection toward clean energy is both ethical and financially rational.' },
  { headline: 'Future generations will judge us by our decisions, not our intentions.', body: 'Good intentions paired with inaction are still inaction.' },
  { headline: 'Rewilding is an act of faith in the future.', body: 'Planting what you will not see, restoring what you did not damage. That is stewardship.' },
  { headline: 'Schools built today should be climate-resilient by design.', body: 'The children learning in them will live in a different climate. Design for theirs, not ours.' },
  { headline: 'What children learn about nature will shape how they protect it.', body: 'Ecological literacy is not a subject. It is a lens for understanding everything.' },
  { headline: 'The precautionary principle: if in doubt about harm, don\'t.', body: 'Future-proofing by design is cheaper than remediating damage after the fact.' },
  { headline: 'Fossil fuel subsidies are debts charged to future generations.', body: 'We are borrowing from the future to subsidise the present. The ledger will be presented.' },
  { headline: 'The best investment in the future is an empowered young person.', body: 'Education, agency, and resources given to young people generate returns for decades.' },
  { headline: 'Thinking in centuries is not naive. It is the original planning horizon.', body: 'Ancient forests, cathedrals, and commons were all designed for time beyond one lifetime.' },
  { headline: 'We stand on the shoulders of those who came before us.', body: 'Stand in a way that makes it easier for those who come after to stand on ours.' },
  { headline: 'Hope is not wishful thinking. It is a disciplined practice.', body: 'Evidence supports hope: technologies exist, movements are growing, change is possible.' },
  { headline: 'The future is not written. It is built — decision by decision.', body: 'Including this one. Including today.' },
  // ── Economic Systems (25) ──
  { headline: 'GDP measures activity — not wellbeing, equity, or sustainability.', body: 'A car crash increases GDP. We are measuring the wrong things.' },
  { headline: 'The doughnut economy defines a safe and just space for humanity.', body: 'Stay above the social foundation. Stay below the ecological ceiling.' },
  { headline: 'Degrowth does not mean poverty. It means measuring what matters.', body: 'Shorter weeks, better services, cleaner environments — growth in what matters.' },
  { headline: 'Consumption in the global north drives most environmental degradation.', body: 'The footprint of affluence is the largest single factor in planetary overshoot.' },
  { headline: 'Advertising creates wants. Sustainability begins with questioning them.', body: 'The distance between want and need is where most environmental impact lives.' },
  { headline: 'Planned obsolescence is a design philosophy — durability is a choice.', body: 'Products can be made to last. The decision not to is commercial, not technical.' },
  { headline: 'The cost of climate inaction exceeds the cost of action by 10 to 1.', body: 'This is not an environmental argument. It is a financial one — and it is robust.' },
  { headline: 'Circular business models generate higher margins and lower impact.', body: 'Companies that retain material value in their systems outcompete those that waste it.' },
  { headline: 'The fossil fuel industry has known about climate change since the 1970s.', body: 'Internal documents confirm it. The decades of delay were a deliberate choice.' },
  { headline: 'Consumer boycotts have shifted corporate behaviour throughout history.', body: 'From apartheid to plastic straws, sustained consumer pressure has moved major companies.' },
  { headline: 'True cost accounting includes environmental and social costs.', body: 'Cheap prices often hide costs externalised onto communities, ecosystems, and the future.' },
  { headline: 'Supply chain transparency is the first step to accountability.', body: 'You cannot manage what you cannot see. Transparency enables better decisions throughout.' },
  { headline: 'Buying less is the most powerful consumer act available.', body: 'Not which product to buy — whether to buy at all. That is the highest-leverage question.' },
  { headline: 'Business as usual is the riskiest strategy in a changing climate.', body: 'Physical risk, stranded assets, and regulatory change all point the same way.' },
  { headline: 'The most resilient economies are diversified and local.', body: 'Long supply chains and single-point dependencies are vulnerabilities, not efficiencies.' },
  { headline: 'Purpose-driven companies outperform profit-only ones in retention.', body: 'Workers stay longer and perform better when the mission connects to something beyond profit.' },
  { headline: 'Subsidy reform is the fastest single policy lever available.', body: 'Shifting support from fossil fuels to renewables requires redirected money, not new money.' },
  { headline: 'Fair pay reduces inequality and increases local spending.', body: 'Money earned by lower-income workers circulates locally. Money at the top tends to leave.' },
  { headline: 'Wellbeing budgets redefine what governments are for.', body: 'New Zealand, Scotland, and Iceland have shown it is possible to govern for flourishing.' },
  { headline: 'Finance flows to what is measured. Measure what matters.', body: 'Carbon accounting, biodiversity accounting, and social accounting belong in every budget.' },
  { headline: 'The most powerful lever you have today is how you spend money.', body: 'Where money flows, power follows. Redirecting it is a form of governance.' },
  { headline: 'Economic systems are human inventions. They can be reinvented.', body: 'Markets, money, and property rights are not laws of nature. They are political choices.' },
  { headline: 'Community wealth building redirects economic power downward.', body: 'Anchor institutions, worker ownership, and local procurement change who benefits.' },
  { headline: 'Natural capital accounting puts value on ecosystems.', body: 'When ecosystems appear on balance sheets, decisions about them change.' },
  { headline: 'Sharing is the original sustainable business model.', body: 'Libraries, commons, and mutual aid predate markets. They still work — often better.' },
  // ── Democracy & Civic Life (15) ──
  { headline: 'Democracy requires participation between every election.', body: 'Show up for local meetings, planning decisions, and community consultations.' },
  { headline: 'Local government makes most decisions that affect daily life.', body: 'Council chambers are where land use, transport, and waste policy are decided.' },
  { headline: 'Freedom of the press is an environmental issue.', body: 'Without investigative journalism, corporate pollution and policy failures go unreported.' },
  { headline: 'Transparency in government is the first condition of accountability.', body: 'Open data, freedom of information, and public audit exist. Use them.' },
  { headline: 'Disinformation weakens collective response to shared challenges.', body: 'Truth is a public good. Its protection requires active, critical citizens.' },
  { headline: 'Civic education is one of the highest-leverage investments any society can make.', body: 'An informed, engaged citizenry is the precondition of a functioning democracy.' },
  { headline: 'Electoral systems shape who holds power.', body: 'Proportional representation changes outcomes. The rules of democracy are not neutral.' },
  { headline: 'Public protest has been the catalyst of most major progressive reforms.', body: 'From votes for women to civil rights, movements that took to streets changed laws.' },
  { headline: 'Open data enables citizens to hold institutions accountable.', body: 'Transparency is not a luxury. It is the infrastructure of democratic governance.' },
  { headline: 'The ballot box and the checkout counter are both forms of governance.', body: 'Every purchase and every vote directs resources. Use both deliberately.' },
  { headline: 'Community organising is the practice of democracy between elections.', body: 'Building power locally is how systemic change becomes possible.' },
  { headline: 'When the people lead, the leaders follow.', body: 'That has remained true in every era of significant social progress.' },
  { headline: 'Campaign finance shapes who gets to govern.', body: 'Money in politics is not a footnote — it is the operating system of many democracies.' },
  { headline: 'Judicial independence protects rights that majorities sometimes prefer to ignore.', body: 'The rule of law and the protection of minority rights are sustainability issues.' },
  { headline: 'Decentralised power tends to be more responsive to those it serves.', body: 'The further decision-making is from those affected, the less well it serves them.' },
  // ── Arts, Culture & Creativity (15) ──
  { headline: 'Art imagines worlds before they exist.', body: 'Stories of possible futures are where political imagination begins. That is why art matters to movements.' },
  { headline: 'Culture shapes what seems possible. Change the culture, change the horizon.', body: 'What is normal in culture becomes normal in policy. Artists lead.' },
  { headline: 'Music has always carried resistance.', body: 'From folk songs to hip-hop, the movements that changed the world had soundtracks.' },
  { headline: 'Storytelling is the oldest technology for changing minds.', body: 'Facts inform. Stories move. We need both.' },
  { headline: 'Theatre and literature have shifted public opinion on rights throughout history.', body: 'From Uncle Tom\'s Cabin to Silent Spring — fiction has changed facts and laws.' },
  { headline: 'Architecture that creates beauty creates wellbeing.', body: 'Buildings are public acts. They shape the air, the light, and the mood of a place.' },
  { headline: 'Street art turns public space into public conversation.', body: 'When walls speak, the city thinks. Public art is civic participation.' },
  { headline: 'Craft reconnects maker to material.', body: 'Knowing how things are made changes how you relate to them — and how much you waste.' },
  { headline: 'Heritage and tradition carry knowledge of how to live in place.', body: 'Cultural continuity is ecological continuity. Both deserve protection.' },
  { headline: 'Design shapes behaviour. Thoughtful design makes sustainable choices the default.', body: 'The built environment is the most pervasive behaviour-change intervention we have.' },
  { headline: 'Beauty is not frivolous. It is what makes places worth protecting.', body: 'We do not protect what we do not love. We do not love what we cannot see as beautiful.' },
  { headline: 'Libraries are archives of the possible.', body: 'Every idea humans have ever had, held for the public. That is a profound institution.' },
  { headline: 'The arts make grief and hope speakable.', body: 'Both are necessary in difficult times. Both deserve expression and community.' },
  { headline: 'Creative communities drive urban regeneration.', body: 'Where artists go, vitality tends to follow — if affordability is protected alongside it.' },
  { headline: 'Film and photography have changed environmental policy.', body: 'Seeing pollution, deforestation, and wildlife on screen has moved public opinion consistently.' },
  // ── Education & Knowledge (10) ──
  { headline: 'Access to education is the highest-leverage long-term investment in equity.', body: 'It is also the strongest predictor of environmental values and civic participation.' },
  { headline: 'Critical thinking is the skill most needed in an era of misinformation.', body: 'Not memorising answers — questioning the questions themselves.' },
  { headline: 'Universal early childhood education has the highest social return of any investment.', body: 'The evidence is consistent across cultures, contexts, and decades.' },
  { headline: 'Open access to scientific knowledge accelerates progress for everyone.', body: 'Paywalled research is knowledge hoarded. Open access is knowledge shared.' },
  { headline: 'Digital literacy is now a civil rights issue.', body: 'Without it, access to information, services, and civic participation is blocked.' },
  { headline: 'Learning throughout life is the precondition for adaptability.', body: 'The pace of change requires continuous learning as a permanent practice.' },
  { headline: 'Education systems that value nature produce people who protect it.', body: 'Ecological literacy is not a subject. It is a way of being in the world.' },
  { headline: 'Knowledge shared freely multiplies. Knowledge hoarded diminishes everyone.', body: 'The commons of knowledge is one of humanity\'s most valuable shared assets.' },
  { headline: 'Teachers shape the values that shape the future.', body: 'What is taught — and how — echoes across generations.' },
  { headline: 'STEM education without ethics produces problems, not solutions.', body: 'Technical power without moral grounding is one of the defining risks of our era.' },
  // ── Human Rights & Dignity (10) ──
  { headline: 'Human dignity is not conditional. It does not need to be earned.', body: 'Every system, policy, and institution should begin from this premise.' },
  { headline: 'Where human rights are protected, environmental rights tend to follow.', body: 'The correlation is not coincidental — both rest on the same foundation of accountability.' },
  { headline: 'The right to health includes the right to a healthy environment.', body: 'Courts and constitutions around the world are increasingly recognising this connection.' },
  { headline: 'Housing is a human right. Its commodification has created a global crisis.', body: 'When shelter becomes an asset class, those who need it most are priced out.' },
  { headline: 'The refugee experience is increasingly climate-driven.', body: 'International protection frameworks must catch up with the reality of who is displaced.' },
  { headline: 'Freedom of assembly is the right to change things collectively.', body: 'Where it is restricted, so is the ability of communities to protect themselves.' },
  { headline: 'Disability rights are civil rights. Inclusive design benefits everyone.', body: 'Accessible environments are better environments — for all users, in all conditions.' },
  { headline: 'Children\'s rights include the right to a stable climate.', body: 'Courts in multiple countries have now recognised this. It is legally enforceable.' },
  { headline: 'Statelessness — no country, no rights — affects 10 million people globally.', body: 'Citizenship is the infrastructure of rights. Its absence is a profound vulnerability.' },
  { headline: 'Dignity in death matters as much as dignity in life.', body: 'Palliative care and community support at end of life are overlooked dimensions of a just society.' },
  // ── Peace & Cooperation (10) ──
  { headline: 'No country has achieved sustainability through conflict.', body: 'Peace is a precondition. Security, stability, and environmental protection reinforce each other.' },
  { headline: 'One week of global military spending could fund a year of climate adaptation.', body: 'Public resources reflect political priorities. Those priorities can change.' },
  { headline: 'Diplomacy and multilateralism are the only tools capable of solving planetary problems.', body: 'No nation alone can manage the atmosphere, the ocean, or pandemic risk.' },
  { headline: 'Non-violence is not passivity. It is the most strategically effective tool for durable change.', body: 'Social movement research consistently shows non-violent campaigns outperform violent ones.' },
  { headline: 'Arms trade fuels conflicts that displace people and destroy ecosystems.', body: 'The connection between militarism and environmental destruction is real and documented.' },
  { headline: 'Truth and reconciliation creates social foundations for long-term stability.', body: 'Acknowledging historical harm is not weakness. It is the precondition for trust.' },
  { headline: 'International institutions are imperfect. The alternative is no cooperation.', body: 'Reform from within is almost always better than withdrawal.' },
  { headline: 'Trade built on fair terms is the foundation of a stable global economy.', body: 'When producers are paid fairly, communities can invest in their own sustainability.' },
  { headline: 'Peacekeeping, conflict prevention, and disarmament are sustainability issues.', body: 'War destroys ecosystems, displaces communities, and consumes resources at enormous scale.' },
  { headline: 'The world has more in common than what divides it.', body: 'Shared challenges require shared responses. That is the premise of a sustainable world.' },
  // ── Science & Curiosity (10) ──
  { headline: 'Science is the best tool humans have for understanding shared reality.', body: 'It is self-correcting, evidence-based, and open to revision. That is its strength.' },
  { headline: 'Curiosity is the original sustainability practice.', body: 'It replaces the need for consumption with the pleasure of wonder. A curious person needs less.' },
  { headline: 'The scientific method is a form of epistemic humility.', body: 'It holds conclusions provisionally and updates them when evidence demands it.' },
  { headline: 'Indigenous knowledge and Western science are more powerful combined.', body: 'Different ways of knowing, applied together, see more of the world.' },
  { headline: 'Citizen science has transformed ecology, astronomy, and public health.', body: 'Ordinary people with basic tools have contributed to discoveries that matter.' },
  { headline: 'Science funding is a public good with incalculable long-term returns.', body: 'Basic research has no obvious immediate application — and has driven most of the innovation we depend on.' },
  { headline: 'We know more about the moon than our own seafloor.', body: 'Ocean science is decades behind land science. That gap matters for everything that lives in and near the sea.' },
  { headline: 'Data without interpretation is noise.', body: 'Good science requires communication as much as discovery. Scientists and storytellers need each other.' },
  { headline: 'The IPCC represents the most reviewed scientific consensus in human history.', body: 'It is not alarmism. It is the most careful collective reading of the evidence available.' },
  { headline: 'Wonder is a survival skill.', body: 'The capacity to find the world astonishing is what motivates its protection.' },
  // ── Technology for Good (5) ──
  { headline: 'Open-source technology lowers the barrier to innovation everywhere.', body: 'Tools shared freely multiply. Tools kept proprietary tend to serve only those who can pay.' },
  { headline: 'Technology transfers are as important as climate finance.', body: 'Without access to clean technology, developing nations face an impossible choice between growth and sustainability.' },
  { headline: 'The internet was built on publicly funded research.', body: 'Its value was created collectively. What was created in common can be governed in common.' },
  { headline: 'Precision agriculture can improve yield while reducing inputs.', body: 'More food, less land, less water, less chemical. The tools already exist.' },
  { headline: 'Digital tools for civic participation expand who can engage with governance.', body: 'Participation at scale, across geography, is now technically possible. The bottleneck is political.' },
  // ── Philosophy & Wisdom (15) ──
  { headline: 'Enough is a radical word in a culture that always wants more.', body: 'The practice of sufficiency — knowing when enough is enough — is both ancient and urgent.' },
  { headline: 'Ubuntu: I am because we are.', body: 'Sustainability is not an individual project. It is the recognition that no one flourishes alone.' },
  { headline: 'Interbeing: nothing exists independently.', body: 'What you do to the world, you do to yourself. The boundary is not where we think it is.' },
  { headline: 'Kaizen: small, continuous improvement produces transformation.', body: 'Daily action, accumulated, is the mechanism of all lasting change.' },
  { headline: 'In the face of uncertain harm, the burden of proof falls on those who would proceed.', body: 'The precautionary principle is not timidity. It is wisdom about irreversibility.' },
  { headline: 'A thing is right when it tends to preserve the integrity of the biotic community.', body: 'Aldo Leopold wrote this in 1949. It remains the clearest statement of ecological ethics we have.' },
  { headline: 'Rachel Carson asked what we owe to the living world.', body: 'She published Silent Spring in 1962. We are still answering that question.' },
  { headline: 'Gratitude as a practice changes what you notice.', body: 'Attention directed by appreciation is one of the most powerful sustainability tools available.' },
  { headline: 'Patience is not passivity. It is the capacity to persist without visible progress.', body: 'Most of the change we care about is slow. That does not make it less real.' },
  { headline: 'Solidarity is the recognition that your wellbeing and mine are not separable.', body: 'It is not charity. It is the acknowledgement of shared fate.' },
  { headline: 'The long view is not fatalism.', body: 'It is the only frame in which the right decisions become legible. Short-termism made most of the messes we are cleaning up.' },
  { headline: 'The man who moves a mountain begins by carrying away small stones.', body: 'Scale is achieved through repetition, not single acts of extraordinary effort.' },
  { headline: 'Wabi-sabi finds beauty in the imperfect, impermanent, and incomplete.', body: 'Less striving, more being. Less acquiring, more appreciating.' },
  { headline: 'Between stimulus and response there is a space.', body: 'Viktor Frankl: in that space lies freedom — to choose, to act differently, to not default.' },
  { headline: 'The world needs more wisdom about how to live with what it has.', body: 'That wisdom exists. It has always existed. The work is applying it.' },
  // ── Courage & Leadership (10) ──
  { headline: 'Leadership is not a position. It is the decision to act before others do.', body: 'Anyone, anywhere, can lead. The first act is the hardest.' },
  { headline: 'Courage is not the absence of fear — it is acting despite it.', body: 'Fear is appropriate when facing large challenges. Courage is what you do with it.' },
  { headline: 'Whistleblowers have done more for environmental protection than many official bodies.', body: 'Exposing what is hidden is one of the bravest and most consequential acts available.' },
  { headline: 'Speaking up in any room is a form of leadership.', body: 'Not everything requires a platform. The immediate circle matters most.' },
  { headline: 'The people who changed history decided not to look away.', body: 'Rosa Parks. Rachel Carson. Wangari Maathai. All started from exactly where they were.' },
  { headline: 'Accountability — for impact, not just intention — is the foundation of trust.', body: 'It is also the most underused leadership practice available.' },
  { headline: 'Moral courage includes the willingness to be unpopular in the short term.', body: 'Most things worth doing face resistance at first. That resistance is information, not a verdict.' },
  { headline: 'The most durable leadership is in service of people and planet.', body: 'Power held on behalf of others is more legitimate and more lasting than power held for itself.' },
  { headline: 'Optimism is a leadership discipline, not a personality trait.', body: 'It is the reasoned belief that action changes outcomes. The evidence supports it.' },
  { headline: 'In complex times, admitting uncertainty opens better conversations.', body: 'Certainty in the face of genuine uncertainty is a failure of honesty, not a sign of strength.' },
  // ── Health & Medicine (10) ──
  { headline: 'Universal healthcare is a sustainability intervention.', body: 'Healthy populations have greater capacity for social and civic participation.' },
  { headline: 'Preventive medicine costs a fraction of curative medicine.', body: 'Investing upstream — in housing, food, and air quality — saves multiples downstream.' },
  { headline: 'Mental health is as important as physical health.', body: 'Both are shaped by environment. Both deserve equal resources and attention.' },
  { headline: 'Antibiotic resistance is a shared-commons problem.', body: 'It requires collective stewardship of a resource — effective antibiotics — that belongs to everyone.' },
  { headline: 'The social determinants of health are environmental issues.', body: 'Housing, food, and air quality shape health. You cannot separate health policy from environmental policy.' },
  { headline: 'Health equity and environmental equity are the same issue in different language.', body: 'Who is sick and who is exposed to pollution are, consistently, the same communities.' },
  { headline: 'Pandemic preparedness is sustainability — protecting shared biological systems.', body: 'Zoonotic disease, habitat loss, and global mobility are all connected. One Health is the framework.' },
  { headline: 'Human, animal, and planetary health are inseparable.', body: 'The veterinary, medical, and environmental fields are learning to work together. Finally.' },
  { headline: 'Traditional medicine holds knowledge the pharmaceutical system has not captured.', body: 'Ethnobotany, traditional healing, and community health workers are undervalued global assets.' },
  { headline: 'Access to healthcare is a moral test for any society that calls itself developed.', body: 'No measure of national success is credible that ignores who gets to be healthy.' },
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

function ShareModal({ data, onClose }: { data: any; onClose: () => void }) {
  const [copied, setCopied] = useState(false)

  const co2     = (data?.co2Saved     ?? 0).toFixed(1)
  const water   = (data?.waterSaved   ?? 0).toFixed(0)
  const waste   = (data?.wasteDiverted ?? 0).toFixed(1)
  const actions = data?.totalActions  ?? 0

  const shareText =
    `🌿 My Challenge Tre3 Impact:\n` +
    `🌬️ ${co2} kg CO₂ saved\n` +
    `💧 ${water} L water saved\n` +
    `♻️ ${waste} kg waste diverted\n` +
    `✅ ${actions} actions completed\n\n` +
    `Join me → https://challenge-tree.vercel.app`

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: 'My Challenge Tre3 Impact', text: shareText })
        .catch(() => {})
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      })
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 480,
          background: 'var(--cream)',
          borderRadius: '20px 20px 0 0',
          padding: '24px 22px 40px',
        }}
      >
        {/* Handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: '#ccc', margin: '0 auto 20px' }} />

        {/* Share card — branded preview */}
        <div style={{
          background: '#1b4332', borderRadius: 16, padding: '22px 20px 18px',
          marginBottom: 20, position: 'relative', overflow: 'hidden',
        }}>
          {/* Watermark */}
          <span style={{
            position: 'absolute', right: 12, top: 8, fontSize: 52,
            opacity: 0.06, userSelect: 'none',
          }}>🌍</span>

          <p style={{
            fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 18,
            color: '#fff', margin: '0 0 2px',
          }}>
            Challenge Tre<span style={{ color: '#c8952a' }}>3</span>
          </p>
          <p style={{
            fontFamily: "'Oswald', sans-serif", fontSize: 10, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', margin: '0 0 18px',
          }}>
            My Impact
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { icon: '🌬️', val: `${co2} kg`,   label: 'CO₂ saved',     color: '#95d5b2' },
              { icon: '💧', val: `${water} L`,   label: 'Water saved',   color: '#74b9e8' },
              { icon: '♻️', val: `${waste} kg`,  label: 'Waste diverted', color: '#b8a9e0' },
              { icon: '✅', val: `${actions}`,   label: 'Actions done',  color: '#f0c96e' },
            ].map(s => (
              <div key={s.label} style={{
                background: 'rgba(255,255,255,0.07)', borderRadius: 10, padding: '10px 12px',
              }}>
                <span style={{ fontSize: 16 }}>{s.icon}</span>
                <p style={{
                  fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 20,
                  color: s.color, margin: '4px 0 1px',
                }}>{s.val}</p>
                <p style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.45)', margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, marginTop: 16,
          }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.12)' }} />
            <span style={{
              fontSize: 9.5, color: 'rgba(255,255,255,0.3)',
              fontFamily: "'Oswald', sans-serif", letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
              challenge-tree.vercel.app
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.12)' }} />
          </div>
        </div>

        {/* Action buttons */}
        <button
          onClick={handleShare}
          style={{
            width: '100%', padding: '14px 0', borderRadius: 12, border: 'none', cursor: 'pointer',
            background: '#1b4332', color: '#fff',
            fontFamily: "'Oswald', sans-serif", fontWeight: 500,
            fontSize: 14, letterSpacing: '0.12em', textTransform: 'uppercase',
            marginBottom: 10,
          }}
        >
          {copied ? 'Copied to clipboard ✓' : (navigator.share ? 'Share my impact 🌿' : 'Copy to clipboard')}
        </button>
        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '12px 0', borderRadius: 12, border: '1.5px solid #ddd',
            cursor: 'pointer', background: 'transparent', color: '#666',
            fontFamily: "'Oswald', sans-serif", fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase',
          }}
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default function ImpactPage() {
  const navigate = useNavigate()
  const [showShare, setShowShare] = useState(false)

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
    <div className="min-h-screen pb-32" style={{ background: 'var(--cream)' }}>

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
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{
                color: '#fff', fontFamily: "'Oswald', sans-serif",
                fontWeight: 600, fontSize: 26, margin: 0,
              }}>
                Your Impact
              </h1>
              <p style={{ color: '#95d5b2', fontSize: 13, marginTop: 4 }}>Every action adds up</p>
            </div>
            <button
              onClick={() => setShowShare(true)}
              style={{
                marginTop: 4,
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '7px 14px', borderRadius: 20,
                background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff', cursor: 'pointer',
                fontFamily: "'Oswald', sans-serif", fontSize: 11.5,
                letterSpacing: '0.1em', textTransform: 'uppercase',
              }}
            >
              Share 🌿
            </button>
          </div>
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
      <BottomNav />

      {showShare && <ShareModal data={data} onClose={() => setShowShare(false)} />}
    </div>
  )
}
