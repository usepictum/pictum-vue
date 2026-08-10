<script setup lang="ts">
// biome-ignore lint/correctness/noUnusedImports: Components are consumed by the Vue template.
import { Avatar, Icon, Placeholder, QrCode } from "@pictum/vue";
</script>

<template>
	<main>
		<header>
			<h1>Pictum Vue</h1>
			<p>Asset component playground</p>
		</header>

		<section aria-labelledby="avatars-heading">
			<div class="section-heading">
				<h2 id="avatars-heading">Avatars</h2>
				<span>5 variants</span>
			</div>
			<div class="samples avatars">
				<figure>
					<div class="preview">
						<Avatar
							seed="ada-lovelace"
							variant="identicon"
							format="svg"
							alt="Identicon avatar"
						/>
					</div>
					<figcaption><strong>Identicon</strong><code>svg</code></figcaption>
				</figure>
				<figure>
					<div class="preview">
						<Avatar
							seed="grace-hopper"
							variant="gradient"
							format="jpg"
							alt="Gradient avatar"
						/>
					</div>
					<figcaption><strong>Gradient</strong><code>jpg</code></figcaption>
				</figure>
				<figure>
					<div class="preview">
						<Avatar
							seed="margaret-hamilton"
							variant="initials"
							format="png"
							alt="Initials avatar"
						/>
					</div>
					<figcaption><strong>Initials</strong><code>png</code></figcaption>
				</figure>
				<figure>
					<div class="preview">
						<Avatar
							seed="customer-female"
							variant="realistic"
							gender="female"
							format="webp"
							alt="Realistic female avatar"
						/>
					</div>
					<figcaption>
						<strong>Realistic</strong><code>female · webp</code>
					</figcaption>
				</figure>
				<figure>
					<div class="preview">
						<Avatar
							seed="customer-male"
							variant="realistic"
							gender="male"
							format="jpg"
							alt="Realistic male avatar"
						/>
					</div>
					<figcaption>
						<strong>Realistic</strong><code>male · jpg</code>
					</figcaption>
				</figure>
			</div>
		</section>

		<section aria-labelledby="icons-heading">
			<div class="section-heading">
				<h2 id="icons-heading">Icons</h2>
				<span>Inline SVG</span>
			</div>
			<div class="samples icons">
				<figure>
					<div class="preview">
						<Icon name="lucide:image" aria-label="Image" />
					</div>
					<figcaption><strong>Image</strong><code>lucide:image</code></figcaption>
				</figure>
				<figure>
					<div class="preview">
						<Icon name="lucide:scan-qr-code" aria-label="Scan QR code" />
					</div>
					<figcaption>
						<strong>QR code</strong><code>lucide:scan-qr-code</code>
					</figcaption>
				</figure>
				<figure>
					<div class="preview">
						<Icon name="lucide:user-round" aria-label="User" />
					</div>
					<figcaption>
						<strong>User</strong><code>lucide:user-round</code>
					</figcaption>
				</figure>
				<figure>
					<div class="preview">
						<Icon name="lucide:sparkles" aria-label="Sparkles" />
					</div>
					<figcaption>
						<strong>Sparkles</strong><code>lucide:sparkles</code>
					</figcaption>
				</figure>
			</div>
		</section>

		<section aria-labelledby="qr-codes-heading">
			<div class="section-heading">
				<h2 id="qr-codes-heading">QR codes</h2>
				<span>4 examples</span>
			</div>
			<div class="samples qr-codes">
				<figure>
					<div class="preview">
						<QrCode value="https://pictum.dev" format="svg" alt="SVG QR code" />
					</div>
					<figcaption><strong>SVG</strong><code>svg</code></figcaption>
				</figure>
				<figure>
					<div class="preview">
						<QrCode value="https://pictum.dev" format="png" alt="PNG QR code" />
					</div>
					<figcaption><strong>PNG</strong><code>png</code></figcaption>
				</figure>
				<figure>
					<div class="preview">
						<QrCode
							value="https://pictum.dev"
							format="webp"
							alt="WebP QR code"
						/>
					</div>
					<figcaption><strong>WebP</strong><code>webp</code></figcaption>
				</figure>
				<figure>
					<div class="preview">
						<QrCode
							value="https://pictum.dev"
							:quiet-zone="false"
							alt="QR code without a quiet zone"
						/>
					</div>
					<figcaption>
						<strong>No quiet zone</strong><code>quiet_zone=0</code>
					</figcaption>
				</figure>
			</div>
		</section>

		<section aria-labelledby="placeholders-heading">
			<div class="section-heading">
				<h2 id="placeholders-heading">Placeholders</h2>
				<span>4 formats</span>
			</div>
			<div class="samples placeholders">
				<figure>
					<div class="preview">
						<Placeholder
							:size="144"
							format="svg"
							text="SVG"
							alt="Square SVG placeholder"
						/>
					</div>
					<figcaption><strong>SVG</strong><code>144 × 144</code></figcaption>
				</figure>
				<figure>
					<div class="preview">
						<Placeholder
							:width="240"
							:height="144"
							format="jpg"
							text="JPG"
							alt="JPG placeholder"
						/>
					</div>
					<figcaption><strong>JPG</strong><code>1×</code></figcaption>
				</figure>
				<figure>
					<div class="preview">
						<Placeholder
							:width="240"
							:height="144"
							format="png"
							:density="2"
							text="PNG"
							alt="Retina PNG placeholder"
						/>
					</div>
					<figcaption><strong>PNG</strong><code>2×</code></figcaption>
				</figure>
				<figure>
					<div class="preview">
						<Placeholder
							:width="240"
							:height="144"
							format="webp"
							:density="3"
							background="#202020"
							color="#ffffff"
							text="WebP"
							alt="Custom WebP placeholder"
						/>
					</div>
					<figcaption><strong>WebP</strong><code>3× · custom</code></figcaption>
				</figure>
			</div>
		</section>
	</main>
</template>
