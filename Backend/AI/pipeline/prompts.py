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

For "bg_tone": pick a tone that contrasts well with the product ('white', 'light_gray', 'cool_gray', 'warm_beige', 'charcoal', or 'black'). For metal items prefer 'black' unless the item is dark. Always output a valid tone (use 'white' by default).

For "lighting_severity": "none" if lighting is already even and well-lit, "mild", "moderate", or "severe" only if badly patchy or very dark.

For "set_reflection": true if the product is a polished or reflective metal item with no extraneous subjects in foreground.
"""


DESCRIPTION_PROMPT_TEMPLATE = """You are helping a rural Indian artisan create an online product listing.
The artisan recorded a voice note describing their handmade product, which has been transcribed into text below. The text is in hindi.
Read the transcript directly --understand it in its original language and then generate the bulleted listing description in english and hindi.
Transcript:
\"\"\"{transcript}\"\"\"
Return ONLY a JSON object, no extra text.
"""