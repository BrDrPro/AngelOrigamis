import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from '../../CartContext/CartContext';
import { fetchProducts } from '../../../api/products';
import './Services.css';
import './ServicesResponsive.css';
import categoryDescriptions from '../../../data/categoryDescriptions';

function groupProductsByCategory(products) {
	const grouped = {};
	products.forEach((prod) => {
		if (Array.isArray(prod.imageUrls) && prod.imageUrls[0]) {
			if (!grouped[prod.category]) grouped[prod.category] = [];
			grouped[prod.category].push(prod);
		}
	});
	return grouped;
}

function Services() {
	const { addToCart } = useContext(CartContext);
	const [addedMsg, setAddedMsg] = useState(false);
	const [carouselIndex, setCarouselIndex] = useState({});
	const [openCategories, setOpenCategories] = useState({});
	const [expandedProduct, setExpandedProduct] = useState(null);
	const [modalImageIndex, setModalImageIndex] = useState(0);
	const [carouselPaused, setCarouselPaused] = useState(false);
	const [products, setProducts] = useState([]);

	useEffect(() => {
		fetchProducts().then(setProducts).catch(console.error);
	}, []);

	const categories = groupProductsByCategory(products);

	function handleAdd(product) {
		addToCart(product);
		setAddedMsg(true);
		setTimeout(() => setAddedMsg(false), 2000);
	}

	// Scroll infinito para o carrossel de cada categoria
	function nextSlide(categoryId, productsLength) {
		const itemsPerView = 3;
		setCarouselIndex((prev) => {
			const current = prev[categoryId] || 0;
			const maxIndex = Math.max(0, productsLength - itemsPerView);
			return {
				...prev,
				[categoryId]: current >= maxIndex ? 0 : current + 1,
			};
		});
	}

	function prevSlide(categoryId, productsLength) {
		const itemsPerView = 3;
		setCarouselIndex((prev) => {
			const current = prev[categoryId] || 0;
			const maxIndex = Math.max(0, productsLength - itemsPerView);
			return {
				...prev,
				[categoryId]: current <= 0 ? maxIndex : current - 1,
			};
		});
	}

	function toggleCategory(categoryId) {
		setOpenCategories((prev) => ({
			...prev,
			[categoryId]: !prev[categoryId],
		}));
	}

	return (
		<div className="services-container">
			<section className="services-hero">
				<div className="services-hero-content">
					<h1>Nossas Criações Artesanais</h1>
					<p>Conheça cada peça e seu significado</p>
				</div>
			</section>

			<section className="services-categories">
				{Object.entries(categories)
					.filter(([_, products]) => products.length > 0)
					.map(([categoryName, products]) => {
						const index = carouselIndex[categoryName] || 0;
						const itemsPerView = 3;
						const maxIndex = Math.max(0, products.length - itemsPerView);

						// Scroll infinito: mostra os produtos em sequência circular
						const isMobile = window.innerWidth <= 768;
						const visibleProducts = isMobile
							? products
							: products.slice(index, index + itemsPerView);

						const isOpen = openCategories[categoryName];

						return (
							<div key={categoryName} className="service-category">
								<button
									className={`category-header dropdown-toggle${
										isOpen ? ' open' : ''
									}`}
									onClick={() => toggleCategory(categoryName)}
								>
									<img
										src="/assets/mandalarosa.png"
										alt=""
										className="mandala-decor"
										aria-hidden="true"
									/>
									<h3>{categoryName}</h3>
									<span className="dropdown-arrow">
										{isOpen ? '▲' : '▼'}
									</span>
								</button>
								{isOpen && (
									<>
										{categoryDescriptions[categoryName] && (
											<p className="category-desc">
												{categoryDescriptions[categoryName]}
											</p>
										)}
										<div className="carousel-container">
											{products.length > 3 && (
												<button
													className="carousel-button prev"
													onClick={() => prevSlide(categoryName, products.length)}
													disabled={products.length <= itemsPerView}
												>
													&#10094;
												</button>
											)}
											<div
												className={`carousel-track${
													products.length < itemsPerView ? ' center-items' : ''
												}`}
											>
												{visibleProducts.map((product) => (
													<div key={product.id} className="carousel-item">
														<div className="product-card">
															<div
																className="product-image-container"
																style={{
																	backgroundImage: product.imageUrls
																		? `url(${product.imageUrls[0]})`
																		: undefined,
																	backgroundSize: 'cover',
																	backgroundPosition: 'center',
																	backgroundRepeat: 'no-repeat',
																	borderRadius: '8px',
																	width: '100%',
																	height: '300px',
																}}
															/>
															<h4>{product.name}</h4>
															<div className="product-card-content">
																<span
																	className="descricao-link"
																	onClick={() => {
																		setExpandedProduct(product);
																		setCarouselPaused(true);
																		setModalImageIndex(0);
																	}}
																>
																	Descrição
																</span>
																<span className="service-price">
																	{typeof product.price === 'number'
																		? `R$ ${Number(product.price).toLocaleString(
																				'pt-BR',
																				{ minimumFractionDigits: 2 }
																		  )}`
																		: product.price}
																</span>
																<button
																	className="add-cart-btn"
																	onClick={() => handleAdd(product)}
																>
																	Adicionar ao Carrinho
																</button>
															</div>
														</div>
													</div>
												))}
											</div>
											{products.length > 3 && (
												<button
													className="carousel-button next"
													onClick={() => nextSlide(categoryName, products.length)}
													disabled={products.length <= itemsPerView}
												>
													&#10095;
												</button>
											)}
										</div>
									</>
								)}
							</div>
						);
					})}
			</section>

			{addedMsg && (
				<div className="cart-feedback">Produto adicionado ao carrinho!</div>
			)}

			{expandedProduct && (
				<div
					className="modal-overlay"
					onClick={() => {
						setExpandedProduct(null);
						setCarouselPaused(false);
						setModalImageIndex(0);
					}}
				>
					<div className="modal-card" onClick={(e) => e.stopPropagation()}>
						<div
							className="product-image-container"
							style={{
								backgroundImage: expandedProduct.imageUrls
									? `url(${expandedProduct.imageUrls[modalImageIndex]})`
									: undefined,
								backgroundSize: 'contain',
								backgroundPosition: 'center',
								backgroundRepeat: 'no-repeat',
								borderRadius: '8px',
								width: '100%',
								height: '380px',
								marginBottom: '1rem',
								backgroundColor: 'var(--bege-logo)',
							}}
						>
							{expandedProduct.imageUrls &&
								expandedProduct.imageUrls.length > 1 && (
									<>
										<button
											className="modal-arrow left"
											onClick={(e) => {
												e.stopPropagation();
												setModalImageIndex((idx) =>
													idx === 0
														? expandedProduct.imageUrls.length - 1
														: idx - 1
												);
											}}
										>
											&#10094;
										</button>
										<button
											className="modal-arrow right"
											onClick={(e) => {
												e.stopPropagation();
												setModalImageIndex((idx) =>
													idx === expandedProduct.imageUrls.length - 1
														? 0
														: idx + 1
												);
											}}
										>
											&#10095;
										</button>
									</>
								)}
						</div>
						<h3>{expandedProduct.name}</h3>
						<p>{expandedProduct.description}</p>
						<span className="service-price">
							{typeof expandedProduct.price === 'number'
								? `R$ ${Number(expandedProduct.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
								: expandedProduct.price}
						</span>
						<button
							className="add-cart-btn"
							onClick={() => handleAdd(expandedProduct)}
						>
							Adicionar ao Carrinho
						</button>
						<button
							className="close-btn"
							onClick={() => {
								setExpandedProduct(null);
								setCarouselPaused(false);
								setModalImageIndex(0);
							}}
						>
							Fechar
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default Services;