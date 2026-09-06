ANALYSIS_PROMPT = """You are a photo quality inspector for a handicraft e-commerce listing.
Look at this product photo and return ONLY a JSON object, no extra text.

For "needs_bg_removal": set true unless the background is already a clean, flat,
seamless studio backdrop (solid color, no wrinkles, no shadows, no texture). Fabric,
wood tables, floors, wrinkled cloth, patterned surfaces, or anything with visible
shadow gradients all count as "needs removal" — a real background almost always does.

For "contains_extraneous_subject": true if a hand, arm, mannequin part, or any
non-product object is holding, touching, or overlapping the product itself
(not just present in the background). This matters even when the background
will be removed, because that hand/arm will remain in the cutout.

For "bg_tone": only relevant when needs_bg_removal is true. Pick whichever tone
will contrast well with the product. For metal items choose 'black' unless the piece itself is dark —
in that case prefer a light neutral instead so the piece doesn't disappear.

For "lighting_severity": "none" if lighting already looks even and well-lit,
"severe" only if it's badly patchy or very dark/harsh.

set_reflection: true If the product in the image is metal item with no 
extraneous_subject in the background. Also set the image bg_tone to black.
"""


DESCRIPTION_PROMPT_TEMPLATE = """You are helping a rural Indian artisan create an online product listing.
The artisan recorded a voice note describing their handmade product, which has been transcribed into text below. The text is in hindi.
Read the transcript directly --understand it in its original language and then generate the bulleted listing description in english and hindi.
Transcript:
\"\"\"{transcript}\"\"\"
Return ONLY a JSON object, no extra text.
"""