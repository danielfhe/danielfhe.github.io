import ClassUtils from './ClassUtils';

test('getWeaponMultiplier works for non hero', () => {
    let weapon = 'Cannon';
    let className = 'not hero';

    let result = ClassUtils.getWeaponMultiplier(weapon, className);

    expect(result).toEqual(1.50)
});

test('getWeaponMultiplier works for hero', () => {
  let weapon = 'One-handed Axe';
  let className = 'Hero';

  let result = ClassUtils.getWeaponMultiplier(weapon, className);

  expect(result).toEqual(1.30)
});
