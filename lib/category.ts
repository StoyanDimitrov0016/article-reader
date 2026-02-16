export function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// btc manual mining and a token reward on ethereum for trying / gamification

// adhesive door hooks
// toothbrush squeezer
