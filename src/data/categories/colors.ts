import type { LearningCategory } from "@/types/category";

const COLORS = [
  ["Red", "#E74C3C"], ["Blue", "#3498DB"], ["Green", "#2ECC71"], ["Yellow", "#F1C40F"],
  ["Orange", "#F39C12"], ["Purple", "#9B59B6"], ["Pink", "#FF69B4"], ["Brown", "#795548"],
  ["Black", "#000000"], ["White", "#FFFFFF"],
] as const;

const FACTS = [
  "Red is the color of apples, strawberries, and fire trucks.",
  "Blue is the color of a clear sky and the deep ocean.",
  "Green is the color of grass, leaves, and trees.",
  "Yellow is the bright color of the sun and ripe bananas.",
  "Orange is a mix of red and yellow, just like the fruit it's named after.",
  "Purple is a mix of red and blue, seen in grapes and violets.",
  "Pink is a soft, light shade of red, like the color of many flowers.",
  "Brown is the color of tree bark, soil, and chocolate.",
  "Black is the darkest color, like the night sky with no stars out.",
  "White is the color of snow, clouds, and fresh milk.",
] as const;

const COLORS_LONG_DESCRIPTIONS = [
  "Red is one of the boldest colors you will ever see, and it loves to grab your attention. Juicy strawberries, ripe apples, and fire trucks all wear red proudly, almost like they are shouting hello. Stop signs and traffic lights use red too, because our brains learn quickly that red means pay attention or stop and think. When you mix red with white, you get soft, gentle pink, and mixing it with yellow makes cheerful orange. Many people say red makes them feel excited, brave, or full of energy, like the feeling before a race begins. Ladybugs wear red with black spots as a way of warning hungry birds to stay away. Whatever red touches, it tends to make the world feel a little louder and more alive.",
  "Look up on a clear day and you will find blue stretched across the entire sky, and look out at the ocean and you will find blue again, deeper and cooler. Blue is often called a calming color, the kind that helps people feel peaceful, relaxed, and safe, which is why so many bedrooms and pajamas use it. Blueberries, bluebirds, and some butterflies carry this color into nature in small, delightful ways. If you mix blue with yellow, something magical happens and green appears, and mixing blue with red gives you purple. Water looks blue partly because it reflects the sky and partly because water absorbs other colors of light. Many flags around the world include blue because it can stand for trust, loyalty, and open skies. Blue is a color that seems to invite you to take a deep breath and slow down.",
  "Green is the color of growing things, from the tiniest blade of grass to the tallest, oldest tree in the forest. Leaves turn green because of something called chlorophyll, a tiny green helper inside plants that captures sunlight and turns it into food. Frogs, grasshoppers, and turtles often wear green so they can hide among leaves and grass without being seen. You can make green yourself by mixing blue and yellow paint together, watching the two colors swirl into a brand new one. Green traffic lights tell cars and bicycles that it is safe to go, so green often feels connected to freshness and new beginnings. Many people find green relaxing to look at, maybe because it reminds them of parks, gardens, and quiet walks outside. Spring is famous for filling the world with bright new green.",
  "Yellow bursts onto the scene like sunshine itself, bright and cheerful and impossible to ignore. The sun, ripe bananas, fluffy baby chicks, and cheerful daffodils all share this happy color. Many people say yellow makes them feel joyful, warm, and full of energy, almost like a smile turned into a color. Mixing yellow with blue creates green, and mixing it with red creates orange, so yellow loves teaming up with its neighbors. School buses are painted yellow because it is one of the easiest colors for our eyes to spot quickly, which helps keep children safe. Bees are famous for their yellow and black stripes, a pattern that warns other animals to be careful. Yellow reminds many people of long summer days and fields of blooming sunflowers.",
  "Orange is what happens when playful red and sunny yellow decide to mix together, blending into a warm, glowing color all its own. Pumpkins, carrots, oranges, and autumn leaves all show off this cozy color at different times of the year. Many people connect orange with harvest time, crackling bonfires, and the crisp feeling of fall afternoons. It is also a color full of energy and enthusiasm, often described as friendly and welcoming rather than calm and quiet. Construction cones and safety vests use bright orange because it stands out clearly against gray roads and green grass, helping keep workers safe. Clownfish wear bold orange and white stripes as they dart between the coral in the sea. Orange has a way of making things feel warm, cheerful, and a little bit exciting.",
  "Purple has always felt a little bit magical and royal, and long ago it was so rare and expensive that only kings and queens could afford to wear it. Grapes, plums, eggplants, and lavender flowers all bring shades of purple into the natural world. You can create purple by mixing red and blue paint, and depending on how much of each color you use, you can make it lighter or darker. Because purple mixes a cool color and a warm color together, some people say it feels both calm and creative at the same time. Amethyst, a beautiful purple gemstone, is sometimes called a birthstone for people born in February. Purple often shows up in stories about wizards, magic, and mystery, adding a sense of wonder. Many children love purple because it feels imaginative, unusual, and a little bit special.",
  "Pink is a soft, gentle color made by mixing red with plenty of white, which takes away red's boldness and leaves something sweeter behind. Cherry blossoms, cotton candy, flamingos, and the inside of a seashell all show off pink in their own special way. Flamingos actually get their pink color from tiny shrimp and algae they eat, which is a fun surprise for many kids to learn. Many people describe pink as friendly, playful, and gentle, a color that feels like a warm hug. Pink can also be bold and bright, like a hot pink flower or a neon pink sneaker, showing that one color can have many different moods. Around the world, pink is often connected to kindness, sweetness, and celebration. Whether soft or bright, pink always adds a cheerful sparkle wherever it appears.",
  "Brown might not sparkle like other colors, but it is one of the most important colors in the whole world because it is the color of earth itself. Tree trunks, soil, chocolate, and the fur of bears, dogs, and horses all wear shades of brown. You can make brown by mixing all three primary colors together, or by mixing orange with a little blue, which is a fun experiment to try with paint. Brown often makes people think of cozy things, like warm blankets, wooden furniture, and the smell of fresh bread. In autumn, leaves that were once green and gold eventually turn brown before they drift to the ground. Many animals use brown fur or feathers to blend into tree bark and dirt, hiding safely from predators. Brown is a steady, comforting color that shows up almost everywhere outdoors.",
  "Black is the color of the night sky far away from city lights, when only stars manage to shine through the darkness. Cats, crows, and the shiny shell of a beetle can all appear in deep, glossy black. In painting, black usually is not mixed from other colors but used on its own to make shadows darker or shapes bolder. Many people wear black because it looks elegant and pairs easily with almost any other color, from bright red to soft yellow. Black absorbs light rather than reflecting it, which is one reason a black car can feel warmer in the sun than a white one. Panda bears use patches of black fur around their eyes and ears, making them instantly recognizable. Black often stands for mystery and strength, giving it a quiet, powerful presence.",
  "White is what you see when all the colors of light mix together, which might seem surprising since white looks so plain and simple. Snowflakes, clouds, milk, and the fluffy fur of a polar bear all share this bright, clean color. Painters often use white to lighten other colors, turning bold red into soft pink or deep blue into a cool, pale shade. Many people connect white with freshness, cleanliness, and new beginnings, like a blank page ready for a new drawing. Doves, often painted stark white, are sometimes used in stories and celebrations as a symbol of peace. In hot places, buildings are sometimes painted white because it reflects sunlight and helps keep rooms cooler inside. White has a quiet, gentle beauty that pairs well with nearly any other color you can imagine.",
] as const;

export const colorsCategory: LearningCategory = {
  slug: "colors",
  icon: "●",
  title: "Colors",
  subtitle: "10 colors with voice",
  color: "#A45EEA",
  trace: false,
  items: COLORS.map(([name, hex], index) => ({
    id: `colors-${index}`,
    symbol: "●",
    label: name,
    detail: "Color",
    speech: name,
    visualColor: hex,
    fact: FACTS[index],
    longDescription: COLORS_LONG_DESCRIPTIONS[index],
  })),
};
